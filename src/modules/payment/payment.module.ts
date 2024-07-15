import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PaymentService} from "./payment.service";
import {PaymentController} from "./payment.controller";

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
