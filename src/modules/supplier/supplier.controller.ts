import {
  Controller,
  Post,
  Body,
  Put,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
  UploadDocsDto,
} from "./dto/supplier.dto";
import {CheckOtpDto, SendOtpDto} from "../auth/dto/otp.dto";
import {SupplierAuth} from "src/common/decorators/auth.decorator";
import {UploadFileFieldsS3} from "src/common/interceptors/upload-file.interceptor";
import {ApiConsumes} from "@nestjs/swagger";
import {FormType} from "src/common/enum/form-type.enum";

@Controller("supplier")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}
  @Post("/send-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.supplierService.sendOtp(otpDto);
  }
  @Post("/signup")
  signup(@Body() supplierDto: SupplierSignupDto) {
    return this.supplierService.signup(supplierDto);
  }
  @Post("/check-otp")
  checkOtp(@Body() SendOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(SendOtpDto);
  }
  @Post("/supplementary-information")
  @SupplierAuth()
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }
  @Put("/upload-documents")
  @ApiConsumes(FormType.Multipart)
  @SupplierAuth()
  @UseInterceptors(
    UploadFileFieldsS3([
      {name: "acceptedDoc", maxCount: 1},
      {name: "image", maxCount: 1},
    ])
  )
  uploadDocument(@Body() infoDto: UploadDocsDto, @UploadedFiles() files: any) {
    return this.supplierService.uploadDocuments(files);
  }
}
