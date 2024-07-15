import {ApiProperty} from "@nestjs/swagger";

export class BasketDto {
  @ApiProperty()
  foodId: number;
}
export class DiscountBasketDto {
  @ApiProperty()
  code: string;
}
