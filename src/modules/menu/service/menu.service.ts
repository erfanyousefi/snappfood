import {Injectable} from "@nestjs/common";
import {FoodDto, UpdateFoodDto} from "../dto/food.dto";

@Injectable()
export class MenuService {
  constructor() {}

  async create(foodDto: FoodDto, image: Express.Multer.File) {}
  async update(
    id: number,
    foodDto: UpdateFoodDto,
    image: Express.Multer.File
  ) {}
  async findAll() {}
  async findOne(id: number) {}
  async delete(id: number) {}
}
