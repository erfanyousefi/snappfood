import {Module} from "@nestjs/common";
import {OrderController} from "./order.controller";
import {OrderService} from "./order.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
