import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "src/config/typeorm.config";
import {CategoryModule} from "../category/category.module";
import {AuthModule} from "../auth/auth.module";
import {SupplierModule} from "../supplier/supplier.module";
import {MenuController} from "../menu/controllers/menu.controller";
import {MenuModule} from "../menu/menu.module";
import {DiscountModule} from "../discount/discount.module";
import {BasketModule} from "../basket/basket.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    CategoryModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
