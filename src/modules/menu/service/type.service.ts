import {Inject, Injectable, NotFoundException, Scope} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TypeEntity} from "../entities/type.entity";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";

@Injectable({scope: Scope.REQUEST})
export class CategoryService {
  constructor(
    @InjectRepository(TypeEntity)
    private typeRepository: Repository<TypeEntity>,
    @Inject(REQUEST) private req: Request
  ) {}
  async create(createDto: {title: string}) {
    //add supplier id to type
    const type = this.typeRepository.create({title: createDto.title});
    await this.typeRepository.save(type);
    return {
      message: "created",
    };
  }

  async findAll() {
    return await this.typeRepository.findAndCount({
      where: {},
      order: {id: "DESC"},
    });
  }
  async findOneById(id: number) {
    const type = await this.typeRepository.findOneBy({id});
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
}
