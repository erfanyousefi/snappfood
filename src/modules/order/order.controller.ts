import {Controller} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";

@Controller("order")
@ApiTags("Order")
export class OrderController {
  constructor() {}
}
