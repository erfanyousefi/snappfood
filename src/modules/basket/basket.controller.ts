import {Body, Controller, Delete, Get, Post} from "@nestjs/common";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {BasketService} from "./basket.service";
import {BasketDto, DiscountBasketDto} from "./dto/basket.dto";
import {UserAuth} from "src/common/decorators/auth.decorator";
import {FormType} from "src/common/enum/form-type.enum";

@Controller("basket")
@ApiTags("Basket")
@UserAuth()
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Post("/discount")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  addDiscountToBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.addDiscount(discountDto);
  }
  @Delete()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }
  @Delete("/discount")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  removeDiscountFromBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.removeDiscount(discountDto);
  }
  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }
}
