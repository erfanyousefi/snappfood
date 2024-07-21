import {Inject, Injectable, Scope} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {Request} from "express";
import {BasketService} from "../basket/basket.service";
import {ZarinpalService} from "../http/zarinpal.service";

@Injectable({scope: Scope.REQUEST})
export class PaymentService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private basketService: BasketService,
    private zarinpalService: ZarinpalService
  ) {}

  async getGatewayUrl() {
    const {id: userId} = this.req.user;
    const basket = await this.basketService.getBasket();
    return this.zarinpalService.sendRequest({
      amount: basket.payment_amount,
      description: "PAYMENT ORDER",
      user: {email: "erfan@gmail.com", mobile: "09332255768"},
    });
  }
}
