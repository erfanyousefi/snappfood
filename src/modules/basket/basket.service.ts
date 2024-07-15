import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {IsNull, Not, Repository} from "typeorm";
import {UserBasketEntity} from "./entity/basket.entity";
import {BasketDto, DiscountBasketDto} from "./dto/basket.dto";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {MenuService} from "../menu/service/menu.service";
import {DiscountService} from "../discount/discount.service";
import {DiscountEntity} from "../discount/entity/discount.entity";

@Injectable({scope: Scope.REQUEST})
export class BasketService {
  constructor(
    @InjectRepository(UserBasketEntity)
    private basketRepository: Repository<UserBasketEntity>,
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    private menuService: MenuService,
    private discountService: DiscountService,
    @Inject(REQUEST) private req: Request
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const {id: userId} = this.req.user;
    const {foodId} = basketDto;
    const food = await this.menuService.getOne(foodId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        foodId,
      },
    });
    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.basketRepository.create({
        foodId,
        userId,
        count: 1,
      });
    }
    await this.basketRepository.save(basketItem);
    return {
      message: "added food to your basket",
    };
  }
  async removeFromBasket(basketDto: BasketDto) {
    const {id: userId} = this.req.user;
    const {foodId} = basketDto;
    const food = await this.menuService.getOne(foodId);
    let basketItem = await this.basketRepository.findOne({
      where: {
        userId,
        foodId,
      },
    });
    if (basketItem) {
      if (basketItem.count <= 1) {
        await this.basketRepository.delete({id: basketItem.id});
      } else {
        basketItem.count -= 1;
        await this.basketRepository.save(basketItem);
      }
      return {
        message: "remove item from basket",
      };
    }
    throw new NotFoundException("not found food item in basket");
  }
  async getBasket() {
    const {id: userId} = this.req.user;
    const basketItems = await this.basketRepository.find({
      relations: {
        discount: true,
        food: {
          supplier: true,
        },
      },
      where: {
        userId,
      },
    });

    const foods = basketItems.filter((item) => item.foodId);
    const supplierDiscounts = basketItems.filter(
      (item) => item?.discount?.supplierId
    );
    const generalDiscounts = basketItems.find(
      (item) => item?.discount?.id && !item.discount.supplierId
    );
    let total_amount = 0;
    let payment_amount = 0;
    let total_discount_amount = 0;
    let foodList = [];
    for (const item of foods) {
      let discount_amount = 0;
      let discountCode: string = null;
      const {food, count} = item;
      total_amount += food.price * count;
      const supplierId = food.supplierId;
      let foodPrice = food.price * count;
      if (food.is_active && food.discount > 0) {
        discount_amount += foodPrice * (food.discount / 100);
        foodPrice = foodPrice - foodPrice * (food.discount / 100);
      }
      const discountItem = supplierDiscounts.find(
        ({discount}) => discount.supplierId === supplierId
      );
      if (discountItem) {
        const {
          discount: {active, amount, percent, limit, usage, code},
        } = discountItem;
        if (active) {
          if (!limit || (limit && limit > usage)) {
            discountCode = code;
            if (percent && percent > 0) {
              discount_amount += foodPrice * (percent / 100);
              foodPrice = foodPrice - foodPrice * (percent / 100);
            } else if (amount && amount > 0) {
              discount_amount += amount;
              foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
            }
          }
        }
      }
      payment_amount += foodPrice;
      total_discount_amount += discount_amount;
      foodList.push({
        name: food.name,
        description: food.description,
        count,
        image: food.image,
        price: food.price,
        total_amount: food.price * count,
        discount_amount,
        payment_amount: food.price * count - discount_amount,
        discountCode,
        supplierId,
        supplierName: food?.supplier?.store_name,
        supplierImage: food?.supplier?.image,
      });
    }
    let generalDiscountDetail = {};
    if (generalDiscounts?.discount?.active) {
      const {discount} = generalDiscounts;
      if (discount?.limit && discount.limit > discount.usage) {
        let discount_amount = 0;
        if (discount.percent > 0) {
          discount_amount = payment_amount * (discount.percent / 100);
        } else if (discount.amount > 0) {
          discount_amount = discount.amount;
        }
        payment_amount =
          discount_amount > payment_amount
            ? 0
            : payment_amount - discount_amount;
        total_discount_amount += discount_amount;
        generalDiscountDetail = {
          code: discount.code,
          percent: discount.percent,
          amount: discount.amount,
          discount_amount,
        };
      }
    }
    return {
      total_amount,
      payment_amount,
      total_discount_amount,
      foodList,
      generalDiscountDetail,
    };
  }

  async addDiscount(discountDto: DiscountBasketDto) {
    const {code} = discountDto;
    const {id: userId} = this.req.user;
    const discount = await this.discountService.findOneByCode(code);
    if (!discount.active) {
      throw new BadRequestException("This discount code is not active");
    }
    if (discount.limit && discount.limit <= discount.usage) {
      throw new BadRequestException(
        "The capacity of this discount code is full"
      );
    }
    if (
      discount?.expires_in &&
      discount?.expires_in?.getTime() <= new Date().getTime()
    ) {
      throw new BadRequestException("this discount code is expired");
    }
    const userBasketDiscount = await this.basketRepository.findOneBy({
      discountId: discount.id,
      userId,
    });
    if (userBasketDiscount) {
      throw new BadRequestException("Already used discount");
    }
    if (discount.supplierId) {
      const discountOfSupplier = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (discountOfSupplier) {
        throw new BadRequestException(
          "you can not use several of supplier discount "
        );
      }
      const userBasket = await this.basketRepository.findOne({
        relations: {
          food: true,
        },
        where: {
          userId,
          food: {
            supplierId: discount.supplierId,
          },
        },
      });
      if (!userBasket) {
        throw new BadRequestException(
          "you can not use this discount code in basket"
        );
      }
    } else if (!discount.supplierId) {
      const generalDiscount = await this.basketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplierId: IsNull(),
          },
        },
      });
      if (generalDiscount) {
        throw new BadRequestException("Already used general discount");
      }
    }
    await this.basketRepository.insert({
      discountId: discount.id,
      userId,
    });
    return {
      message: "You added discount code successfully",
    };
  }
  async removeDiscount(discountDto: DiscountBasketDto) {
    const {code} = discountDto;
    const {id: userId} = this.req.user;
    const discount = await this.discountService.findOneByCode(code);
    const basketDiscount = await this.basketRepository.findOne({
      where: {
        discountId: discount.id,
      },
    });
    if (!basketDiscount)
      throw new BadRequestException("Not found discount in basket");

    await this.basketRepository.delete({discountId: discount.id, userId});
    return {
      message: "You deleted discount code successfully",
    };
  }
}
