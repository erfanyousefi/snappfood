import {HttpService} from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {catchError, lastValueFrom, map} from "rxjs";

@Injectable()
export class ZarinpalService {
  constructor(private httpService: HttpService) {}

  async sendRequest(data?: any) {
    const {amount, description, user} = data;
    const options = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amount * 10,
      description,
      metadata: {
        email: user?.email ?? "example@gmail.com",
        mobile: user?.mobile ?? "",
      },
      callback_url: "http://localhost:3000/payment/verify",
    };
    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_REQUEST_URL, options, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException("zarinpal error");
          })
        )
    );
    const {authority, code} = result.data;
    if (code == 100 && authority) {
      return {
        code,
        authority,
        gatewayURL: `${process.env.ZARINPAL_GATEWAY_URL}/${authority}`,
      };
    }
    throw new BadRequestException("connection faild in zarinpal");
  }
  async verifyRequest(data?: any) {
    const option = {
      authority: data.authority,
      amount: data.amount * 10,
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    };
    const result = await lastValueFrom(
      this.httpService
        .post(process.env.ZARINPAL_VERIFY_URL, option, {})
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException("zarinpal faild");
          })
        )
    );
    return result;
  }
}
