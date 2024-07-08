import {ApiProperty, PartialType} from "@nestjs/swagger";

export class FoodDto {
  @ApiProperty()
  name: string;
  @ApiProperty({type: "binary"})
  image: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  discount: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  score: number;
}

export class UpdateFoodDto extends PartialType(FoodDto) {}
