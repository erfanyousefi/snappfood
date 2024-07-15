import {EntityNames} from "src/common/enum/entity-name.enum";
import {UserBasketEntity} from "src/modules/basket/entity/basket.entity";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity(EntityNames.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  code: string;
  @Column({type: "double", nullable: true})
  percent: number;
  @Column({type: "double", nullable: true})
  amount: number;
  @Column({nullable: true})
  expires_in: Date;
  @Column({nullable: true})
  limit: number;
  @Column({nullable: true, default: 0})
  usage: number;
  @Column({nullable: true})
  supplierId: number;
  @Column({default: true})
  active: boolean;
  @OneToMany(() => UserBasketEntity, (basket) => basket.discount)
  baskets: UserBasketEntity[];
}
