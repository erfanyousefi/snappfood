import {Inject, Injectable, NotFoundException, Scope} from "@nestjs/common";
import {FoodDto, UpdateFoodDto} from "../dto/food.dto";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {InjectRepository} from "@nestjs/typeorm";
import {MenuEntity} from "../entities/menu.entity";
import {Repository} from "typeorm";
import {MenuTypeService} from "./type.service";
import {S3Service} from "src/modules/s3/s3.service";
import {TypeEntity} from "../entities/type.entity";

@Injectable({scope: Scope.REQUEST})
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(TypeEntity)
    private menuTypeRepository: Repository<TypeEntity>,
    private typeService: MenuTypeService,
    private s3Service: S3Service
  ) {}

  async create(foodDto: FoodDto, image: Express.Multer.File) {
    const {id: supplierId} = this.req.user;
    const {name, description, discount, price, typeId} = foodDto;
    const type = await this.typeService.findOneById(typeId);
    const {Location, Key} = await this.s3Service.uploadFile(image, "menu-item");
    const item = this.menuRepository.create({
      name,
      description,
      discount,
      price,
      typeId: type.id,
      supplierId,
      image: Location,
      key: Key,
    });
    await this.menuRepository.save(item);
    return {
      message: "create",
    };
  }
  async update(
    id: number,
    foodDto: UpdateFoodDto,
    image: Express.Multer.File
  ) {}
  async findAll(supplierId: number) {
    return await this.menuTypeRepository.find({
      where: {supplierId},
      relations: {
        items: true,
      },
    });
  }
  async checkExist(id: number) {
    const {id: supplierId} = this.req.user;
    const item = await this.menuRepository.findOneBy({id, supplierId});
    if (!item) throw new NotFoundException();
    return item;
  }
  async findOne(id: number) {
    const {id: supplierId} = this.req.user;
    const item = await this.menuRepository.findOne({
      where: {id, supplierId},
      relations: {
        type: true,
        feedbacks: {
          user: true,
        },
      },
      select: {
        type: {
          title: true,
        },
        feedbacks: {
          comment: true,
          created_at: true,
          user: {
            first_name: true,
            last_name: true,
          },
          score: true,
        },
      },
    });
    if (!item) throw new NotFoundException();
    return item;
  }
  async getOne(id: number) {
    const item = await this.menuRepository.findOne({
      where: {id},
    });
    if (!item) throw new NotFoundException();
    return item;
  }
  async delete(id: number) {
    const item = await this.findOne(id);
    await this.menuRepository.delete({id});
    return {
      message: "deleted",
    };
  }
}
