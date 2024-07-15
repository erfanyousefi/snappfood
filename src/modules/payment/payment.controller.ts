import {Controller} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";

@Controller("Payment")
@ApiTags("Payment")
export class PaymentController {
  constructor() {}
}
