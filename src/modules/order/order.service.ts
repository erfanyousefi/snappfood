import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import {OrderEntity} from "./entity/order.entity";
import {DataSource, DeepPartial, Repository} from "typeorm";
import {BasketType} from "../basket/basket.type";
import {UserAddressEntity} from "../user/entity/address.entity";
import {OrderItemStatus, OrderStatus} from "./status.enum";
import {OrderItemEntity} from "./entity/order-items.entity";
import {PaymentDto} from "../payment/dto/payment.dto";

@Injectable({scope: Scope.REQUEST})
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,
    private dataSource: DataSource
  ) {}

  async create(basket: BasketType, paymentDto: PaymentDto) {
    const {addressId, description = undefined} = paymentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const {id: userId} = this.req.user;
      const address = await this.userAddressRepository.findOneBy({
        id: addressId,
        userId,
      });
      if (!address) throw new NotFoundException("not found address");
      const {foodList, payment_amount, total_amount, total_discount_amount} =
        basket;
      let order = queryRunner.manager.create(OrderEntity, {
        addressId,
        userId,
        total_amount,
        description,
        discount_amount: total_discount_amount,
        payment_amount,
        status: OrderStatus.Pending,
      });
      order = await queryRunner.manager.save(OrderEntity, order);
      let orderItems: DeepPartial<OrderItemEntity>[] = [];
      for (const item of foodList) {
        orderItems.push({
          count: item.count,
          foodId: item.foodId,
          orderId: order.id,
          status: OrderItemStatus.Pending,
          supplierId: item.supplierId,
        });
      }
      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException("your food list is empty");
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({id});
    if (!order) throw new NotFoundException();
    return order;
  }
  async save(order: OrderEntity) {
    return await this.orderRepository.save(order);
  }
}
