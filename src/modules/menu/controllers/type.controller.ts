import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FormType} from "src/common/enum/form-type.enum";
import {MenuTypeService} from "../service/type.service";
import {MenuTypeDto} from "../dto/menu-type.dto";
import {SupplierAuth} from "src/common/decorators/auth.decorator";

@Controller("menu-type")
@ApiTags("menu-type")
@SupplierAuth()
export class MenuTypeController {
  constructor(private readonly menuTypeService: MenuTypeService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() typeDto: MenuTypeDto) {
    return this.menuTypeService.create(typeDto);
  }
  @Get()
  findAll() {
    return this.menuTypeService.findAll();
  }
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuTypeService.findOneById(id);
  }
  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.menuTypeService.remove(id);
  }
  @Put("/:id")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() typeDto: MenuTypeDto) {
    return this.menuTypeService.update(id, typeDto);
  }
}
