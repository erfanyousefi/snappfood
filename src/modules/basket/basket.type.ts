export type FoodItemsInBasket = {
  foodId: number;
  name: string;
  description?: string;
  count: number;
  image?: string;
  price: number;
  total_amount: number;
  discount_amount: number;
  payment_amount: number;
  discountCode?: string;
  supplierId: number;
  supplierName?: string;
  supplierImage?: string;
};
export type BasketType = {
  total_amount: number;
  payment_amount: number;
  total_discount_amount: number;
  foodList: FoodItemsInBasket[];
  generalDiscountDetail: any;
};
