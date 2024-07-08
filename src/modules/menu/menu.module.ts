import {Module} from "@nestjs/common";
import {MenuService} from "./service/menu.service";
import {MenuController} from "./menu.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MenuEntity} from "./entities/menu.entity";
import {TypeEntity} from "./entities/type.entity";
import {FeedbackEntity} from "./entities/feedback.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, TypeEntity, FeedbackEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
