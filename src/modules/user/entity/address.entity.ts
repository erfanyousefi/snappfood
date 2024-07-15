import {EntityNames} from "src/common/enum/entity-name.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {UserEntity} from "./user.entity";
import {OrderEntity} from "src/modules/order/entity/order.entity";

@Entity(EntityNames.UserAddress)
export class UserAddressEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  province: string;
  @Column()
  city: string;
  @Column()
  address: string;
  @Column({nullable: true})
  postal_code: string;
  @Column()
  userId: number;
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => UserEntity, (user) => user.addressList, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
  @OneToMany(() => OrderEntity, (order) => order.address)
  orders: OrderEntity[];
}
