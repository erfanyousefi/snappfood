import {EntityNames} from "src/common/enum/entity-name.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {FeedbackEntity} from "./feedback.entity";
import {SupplierEntity} from "src/modules/supplier/entities/supplier.entity";
import {TypeEntity} from "./type.entity";
import {UserBasketEntity} from "src/modules/basket/entity/basket.entity";
import {OrderItemEntity} from "src/modules/order/entity/order-items.entity";

@Entity(EntityNames.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column()
  key: string;
  @Column({type: "double"})
  price: number;
  @Column({type: "double", default: 0})
  discount: number;
  @Column({default: false})
  is_active: boolean;
  @Column()
  description: string;
  @Column({type: "double", default: 0})
  score: number;
  @Column()
  typeId: number;
  @Column()
  supplierId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menu, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;
  @ManyToOne(() => TypeEntity, (type) => type.items)
  type: TypeEntity;
  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks: FeedbackEntity[];
  @OneToMany(() => UserBasketEntity, (basket) => basket.food)
  baskets: UserBasketEntity[];
  @OneToMany(() => OrderItemEntity, (order) => order.food)
  orders: OrderItemEntity[];
}
