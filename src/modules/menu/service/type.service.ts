import {Inject, Injectable, NotFoundException, Scope} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TypeEntity} from "../entities/type.entity";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {MenuTypeDto} from "../dto/menu-type.dto";

@Injectable({scope: Scope.REQUEST})
export class MenuTypeService {
  constructor(
    @InjectRepository(TypeEntity)
    private typeRepository: Repository<TypeEntity>,
    @Inject(REQUEST) private req: Request
  ) {}
  async create(createDto: MenuTypeDto) {
    //add supplier id to type
    const {id} = this.req.user;
    const type = this.typeRepository.create({
      title: createDto.title,
      priority: createDto.priority,
      supplierId: id,
    });
    await this.typeRepository.save(type);
    return {
      message: "created",
    };
  }

  async findAll() {
    const {id} = this.req.user;
    return await this.typeRepository.find({
      where: {supplierId: id},
      order: {id: "DESC"},
    });
  }
  async findOneById(id: number) {
    const {id: supplierId} = this.req.user;
    const type = await this.typeRepository.findOneBy({id, supplierId});
    if (!type) throw new NotFoundException("type not found");
    return type;
  }
  async remove(id: number) {
    await this.findOneById(id);
    await this.typeRepository.delete({id});
    return {
      message: "deleted successfully",
    };
  }
  async update(id: number, typeDto: MenuTypeDto) {
    let type = await this.findOneById(id);
    const {title, priority} = typeDto;
    if (title) type.title = title;
    if (priority) type.priority = priority;
    await this.typeRepository.save(type);
    return {
      message: "deleted successfully",
    };
  }
}
