import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {BasketService} from "../basket/basket.service";
import {UserBasketEntity} from "../basket/entity/basket.entity";
import {DiscountService} from "../discount/discount.service";
import {DiscountEntity} from "../discount/entity/discount.entity";
import {MenuEntity} from "../menu/entities/menu.entity";
import {TypeEntity} from "../menu/entities/type.entity";
import {MenuService} from "../menu/service/menu.service";
import {MenuTypeService} from "../menu/service/type.service";
import {OrderEntity} from "../order/entity/order.entity";
import {OrderService} from "../order/order.service";
import {S3Service} from "../s3/s3.service";
import {UserAddressEntity} from "../user/entity/address.entity";
import {PaymentEntity} from "./entity/payment.entity";
import {PaymentController} from "./payment.controller";
import {PaymentService} from "./payment.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserBasketEntity,
      DiscountEntity,
      MenuEntity,
      TypeEntity,
      OrderEntity,
      UserAddressEntity,
      PaymentEntity,
    ]),
  ],
  providers: [
    PaymentService,
    BasketService,
    MenuService,
    DiscountService,
    MenuTypeService,
    OrderService,
    S3Service,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
