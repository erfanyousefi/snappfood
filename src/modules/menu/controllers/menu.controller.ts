import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {MenuService} from "../service/menu.service";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FoodDto, UpdateFoodDto} from "../dto/food.dto";
import {FormType} from "src/common/enum/form-type.enum";
import {UploadFileS3} from "src/common/interceptors/upload-file.interceptor";
import {SupplierAuth} from "src/common/decorators/auth.decorator";
import {SKipAuth} from "src/common/decorators/skip-auth.decorator";

@Controller("menu")
@ApiTags("menu")
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFileS3("image"))
  create(
    @Body() foodDto: FoodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
          new FileTypeValidator({fileType: "image/(png|jpg|jpeg|webp)"}),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.menuService.create(foodDto, image);
  }
  @Get("/get-menu-by-id/:id")
  @SKipAuth()
  findAll(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findAll(id);
  }
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }
  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
  @Put("/:id")
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFileS3("image"))
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() foodDto: UpdateFoodDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.menuService.update(id, foodDto, image);
  }
}
