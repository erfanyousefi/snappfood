import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PaymentService} from "./payment.service";
import {PaymentController} from "./payment.controller";
import {BasketService} from "../basket/basket.service";
import {UserBasketEntity} from "../basket/entity/basket.entity";
import {AuthModule} from "../auth/auth.module";
import {DiscountEntity} from "../discount/entity/discount.entity";
import {MenuService} from "../menu/service/menu.service";
import {DiscountService} from "../discount/discount.service";
import {MenuEntity} from "../menu/entities/menu.entity";
import {TypeEntity} from "../menu/entities/type.entity";
import {MenuTypeService} from "../menu/service/type.service";
import {S3Service} from "../s3/s3.service";
import {OrderEntity} from "../order/entity/order.entity";
import {ZarinpalService} from "../http/zarinpal.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserBasketEntity,
      DiscountEntity,
      MenuEntity,
      TypeEntity,
      OrderEntity,
    ]),
  ],
  providers: [
    PaymentService,
    BasketService,
    MenuService,
    DiscountService,
    MenuTypeService,
    S3Service,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
