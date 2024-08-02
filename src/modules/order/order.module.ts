import {Module} from "@nestjs/common";
import {OrderController} from "./order.controller";
import {OrderService} from "./order.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {OrderEntity} from "./entity/order.entity";
import {OrderItemEntity} from "./entity/order-items.entity";
import {UserAddressEntity} from "../user/entity/address.entity";

@Module({
  imports: [
    AuthModule,

    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, UserAddressEntity]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
