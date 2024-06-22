import {NestFactory} from "@nestjs/core";
import {AppModule} from "./modules/app/app.module";
import {SwaggerConfigInit} from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  await app.listen(3000, () => {
    console.log("http://localhost:3000");
    console.log("http://localhost:3000/swagger");
  });
}
bootstrap();
