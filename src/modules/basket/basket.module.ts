import {Module} from "@nestjs/common";
import {BasketController} from "./basket.controller";
import {BasketService} from "./basket.service";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserBasketEntity} from "./entity/basket.entity";
import {DiscountEntity} from "../discount/entity/discount.entity";
import {DiscountService} from "../discount/discount.service";
import {MenuModule} from "../menu/menu.module";

@Module({
  imports: [
    AuthModule,
    MenuModule,
    TypeOrmModule.forFeature([UserBasketEntity, DiscountEntity]),
  ],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
})
export class BasketModule {}
