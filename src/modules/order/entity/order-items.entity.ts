import {EntityNames} from "src/common/enum/entity-name.enum";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {OrderItemStatus, OrderStatus} from "../status.enum";
import {UserEntity} from "src/modules/user/entity/user.entity";
import {UserAddressEntity} from "src/modules/user/entity/address.entity";
import {MenuEntity} from "src/modules/menu/entities/menu.entity";
import {OrderEntity} from "./order.entity";
import {SupplierEntity} from "src/modules/supplier/entities/supplier.entity";

@Entity(EntityNames.OrderItem)
export class OrderItemEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  foodId: number;
  @Column()
  orderId: number;
  @Column()
  count: number;
  @Column()
  supplierId: number;
  @Column({
    type: "enum",
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;
  @ManyToOne(() => MenuEntity, (menu) => menu.orders, {onDelete: "CASCADE"})
  food: MenuEntity;
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: "CASCADE",
  })
  order: OrderEntity;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.orders, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;
}
