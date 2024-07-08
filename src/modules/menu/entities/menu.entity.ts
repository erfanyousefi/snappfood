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

@Entity(EntityNames.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column({type: "double"})
  price: number;
  @Column({type: "double", default: 0})
  discount: number;
  @Column()
  description: string;
  @Column({type: "double"})
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
}
