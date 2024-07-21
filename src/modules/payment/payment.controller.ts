import {Controller, Post} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {PaymentService} from "./payment.service";
import {UserAuth} from "src/common/decorators/auth.decorator";

@Controller("Payment")
@ApiTags("Payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UserAuth()
  gatewayUrl() {
    return this.paymentService.getGatewayUrl();
  }
}
