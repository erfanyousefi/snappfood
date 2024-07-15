import {Inject, Injectable, Scope} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import {OrderEntity} from "./entity/order.entity";
import {Repository} from "typeorm";

@Injectable({scope: Scope.REQUEST})
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>
  ) {}
}
