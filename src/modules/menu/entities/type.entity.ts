import {EntityNames} from "src/common/enum/entity-name.enum";
import {SupplierEntity} from "src/modules/supplier/entities/supplier.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {MenuEntity} from "./menu.entity";

@Entity(EntityNames.MenuType)
export class TypeEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({default: 0})
  priority: number;
  @Column()
  supplierId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuTypes, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;
  @OneToMany(() => MenuEntity, (food) => food.type)
  items: MenuEntity[];
}
