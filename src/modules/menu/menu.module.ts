import {Module} from "@nestjs/common";
import {MenuService} from "./service/menu.service";
import {MenuController} from "./controllers/menu.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MenuEntity} from "./entities/menu.entity";
import {TypeEntity} from "./entities/type.entity";
import {FeedbackEntity} from "./entities/feedback.entity";
import {MenuTypeController} from "./controllers/type.controller";
import {MenuTypeService} from "./service/type.service";
import {SupplierModule} from "../supplier/supplier.module";

@Module({
  imports: [
    SupplierModule,
    TypeOrmModule.forFeature([MenuEntity, TypeEntity, FeedbackEntity]),
  ],
  controllers: [MenuController, MenuTypeController],
  providers: [MenuService, MenuTypeService],
  exports: [MenuService, MenuTypeService, TypeOrmModule],
})
export class MenuModule {}
