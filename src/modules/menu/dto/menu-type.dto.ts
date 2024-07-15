import {ApiProperty} from "@nestjs/swagger";
import {Length} from "class-validator";

export class MenuTypeDto {
  @ApiProperty()
  @Length(3, 30)
  title: string;
  @ApiProperty()
  priority: number;
}
