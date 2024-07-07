import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfig} from "src/config/typeorm.config";
import {CategoryModule} from "../category/category.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), AuthModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
