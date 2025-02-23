import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from "./dto/supplier.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {SupplierEntity} from "./entities/supplier.entity";
import {Repository} from "typeorm";
import {CategoryService} from "../category/category.service";
import {SupplierOtpEntity} from "./entities/otp.entity";
import {randomInt} from "crypto";
import {CheckOtpDto, SendOtpDto} from "../auth/dto/otp.dto";
import {JwtService} from "@nestjs/jwt";
import {PayloadType} from "../auth/types/payload";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {SupplierStatus} from "./enum/status.enum";
import {DocumentType} from "./type";
import {S3Service} from "../s3/s3.service";

@Injectable({scope: Scope.REQUEST})
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private supplierOtpRepository: Repository<SupplierOtpEntity>,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    private s3Service: S3Service,
    @Inject(REQUEST) private req: Request
  ) {}

  async signup(signupDto: SupplierSignupDto) {
    const {
      categoryId,
      city,
      invite_code,
      manager_family,
      manager_name,
      phone,
      store_name,
    } = signupDto;
    const supplier = await this.supplierRepository.findOneBy({phone});
    if (supplier) throw new ConflictException("supplier account already exist");
    const category = await this.categoryService.findOneById(categoryId);
    let agent: SupplierEntity | null = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({invite_code});
    }
    const mobileNumber = parseInt(phone);
    const account = this.supplierRepository.create({
      manager_name,
      manager_family,
      phone,
      categoryId: category.id,
      city,
      store_name,
      agentId: agent?.id,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });
    await this.supplierRepository.save(account);
    await this.createOtpForSupplier(account);
    return {
      message: "otp code sent successfully",
    };
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const {code, mobile} = otpDto;
    const now = new Date();
    const supplier = await this.supplierRepository.findOne({
      where: {phone: mobile},
      relations: {
        otp: true,
      },
    });
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException("Not Found Account");
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("Otp code is incorrect");
    if (otp.expires_in < now)
      throw new UnauthorizedException("Otp Code is expired");
    if (!supplier.mobile_verify) {
      await this.supplierRepository.update(
        {id: supplier.id},
        {
          mobile_verify: true,
        }
      );
    }
    const {accessToken, refreshToken} = this.makeTokens({
      id: supplier.id,
    });
    return {
      accessToken,
      refreshToken,
      message: "You logged-in successfully",
    };
  }
  async sendOtp(otpDto: SendOtpDto) {
    const {mobile} = otpDto;
    let supplier = await this.supplierRepository.findOneBy({phone: mobile});
    if (!supplier) {
      throw new UnauthorizedException("not found account");
    }
    await this.createOtpForSupplier(supplier);
    return {
      message: "sent code successfully",
    };
  }
  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }
  async saveSupplementaryInformation(infoDto: SupplementaryInformationDto) {
    const {id} = this.req.user;
    const {email, national_code} = infoDto;
    let supplier = await this.supplierRepository.findOneBy({national_code});
    if (supplier && supplier.id !== id) {
      throw new ConflictException("national code already used");
    }
    supplier = await this.supplierRepository.findOneBy({email});
    if (supplier && supplier.id !== id) {
      throw new ConflictException("email already used");
    }
    await this.supplierRepository.update(
      {id},
      {
        email,
        national_code,
        status: SupplierStatus.SupplementaryInformation,
      }
    );
    return {
      message: "updated information successfully",
    };
  }
  async uploadDocuments(files: DocumentType) {
    const {id} = this.req.user;
    const {image, acceptedDoc} = files;
    const supplier = await this.supplierRepository.findOneBy({id});
    const imageResult = await this.s3Service.uploadFile(image[0], "images");
    const docsResult = await this.s3Service.uploadFile(
      acceptedDoc[0],
      "acceptedDoc"
    );
    if (!supplier) throw new NotFoundException('supplier not found')
    if (imageResult) supplier.image = imageResult.Location;
    if (docsResult) supplier.document = docsResult.Location;
    supplier.status = SupplierStatus.UploadedDocument;
    await this.supplierRepository.save(supplier);
    return {
      message: "success",
    };
  }
  makeTokens(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const supplier = await this.supplierRepository.findOneBy({
          id: payload.id,
        });
        if (!supplier) {
          throw new UnauthorizedException("login on your account ");
        }
        return {
          id: supplier.id,
          first_name: supplier.manager_name,
          last_name: supplier.manager_family,
          mobile: supplier.phone,
        };
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }
}
