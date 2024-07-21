import {EntityNames} from "src/common/enum/entity-name.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {OrderStatus} from "../status.enum";
import {UserEntity} from "src/modules/user/entity/user.entity";
import {UserAddressEntity} from "src/modules/user/entity/address.entity";
import {OrderItemEntity} from "./order-items.entity";
import {PaymentEntity} from "src/modules/payment/entity/payment.entity";

@Entity(EntityNames.Order)
export class OrderEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column({nullable: true})
  addressId: number;
  @Column()
  payment_amount: number;
  @Column()
  discount_amount: number;
  @Column()
  total_amount: number;
  @Column({type: "enum", enum: OrderStatus, default: OrderStatus.Pending})
  status: string;
  @Column({nullable: true})
  description: string;
  @ManyToOne(() => UserEntity, (user) => user.orders, {onDelete: "CASCADE"})
  user: UserEntity;
  @ManyToOne(() => UserAddressEntity, (address) => address.orders, {
    onDelete: "SET NULL",
  })
  address: UserAddressEntity;
  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];
  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
}
