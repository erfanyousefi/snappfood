import {HttpModule, HttpService} from "@nestjs/axios";
import {Global, Module} from "@nestjs/common";
import {ZarinpalService} from "./zarinpal.service";

@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      timeout: 5000,
    }),
  ],
  providers: [ZarinpalService], 
  exports: [ZarinpalService],
})
export class HttpApiModule {}
