import {NestFactory} from "@nestjs/core";
import {AppModule} from "./modules/app/app.module";
import {SwaggerConfigInit} from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  const {PORT = 3000} = process.env;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
