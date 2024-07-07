import {Module} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {CategoryController} from "./category.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoryEntity} from "./entities/category.entity";
import {S3Service} from "../s3/s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, S3Service],
})
export class CategoryModule {}
