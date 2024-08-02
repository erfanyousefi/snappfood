import {Body, Controller, Get, Post, Query, Res} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {PaymentService} from "./payment.service";
import {UserAuth} from "src/common/decorators/auth.decorator";
import {PaymentDto} from "./dto/payment.dto";
import {Response} from "express";

@Controller("Payment")
@ApiTags("Payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UserAuth()
  gatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }
  @Get("/verify")
  async verifyPayment(
    @Query("Authority") authority: string,
    @Query("Status") status: string,
    @Res() res: Response
  ) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url);
  }
}
