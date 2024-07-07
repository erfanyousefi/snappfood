import {Controller, Post, Body} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from "./dto/supplier.dto";
import {CheckOtpDto} from "../auth/dto/otp.dto";
import {SupplierAuth} from "src/common/decorators/auth.decorator";

@Controller("supplier")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

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
}
