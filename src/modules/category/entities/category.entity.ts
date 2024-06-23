import {EntityNames} from "src/common/enum/entity-name.enum";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({unique: true})
  slug: string;
  @Column()
  image: string;
  @Column()
  show: boolean;
  @Column({nullable: true})
  parentId: number;
  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    onDelete: "CASCADE",
  })
  parent: CategoryEntity;
  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];
}
