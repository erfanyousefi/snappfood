import {EntityNames} from "src/common/enum/entity-name.enum";
import {DiscountEntity} from "src/modules/discount/entity/discount.entity";
import {MenuEntity} from "src/modules/menu/entities/menu.entity";
import {UserEntity} from "src/modules/user/entity/user.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity(EntityNames.UserBasket)
export class UserBasketEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({nullable: true})
  foodId: number;
  @Column()
  userId: number;
  @Column({nullable: true})
  count: number;
  // @Column({enum: BasketDiscountType, type: "enum", nullable: true})
  // type: string;
  @Column({nullable: true})
  discountId: number;
  @ManyToOne(() => MenuEntity, (food) => food.baskets, {onDelete: "CASCADE"})
  food: MenuEntity;
  @ManyToOne(() => UserEntity, (user) => user.basket, {onDelete: "CASCADE"})
  user: UserEntity;
  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: "CASCADE",
  })
  discount: DiscountEntity;
}
