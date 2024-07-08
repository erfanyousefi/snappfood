import {EntityNames} from "src/common/enum/entity-name.enum";
import {UserEntity} from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {MenuEntity} from "./menu.entity";

@Entity(EntityNames.Feedbacks)
export class FeedbackEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column()
  foodId: number;
  @Column()
  score: number;
  @Column()
  comment: string;
  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {onDelete: "CASCADE"})
  user: UserEntity;
  @ManyToOne(() => MenuEntity, (food) => food.feedbacks, {onDelete: "CASCADE"})
  food: MenuEntity;
  @CreateDateColumn()
  created_at: Date;
}
