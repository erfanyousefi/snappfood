import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {config} from "dotenv";
import {join} from "path";
import {DataSourceOptions} from "typeorm";

config();
config({
  path: join(process.cwd(), `.env.${process.env.NodeEnv}`),
});
export function TypeOrmConfig(): TypeOrmModuleOptions {
  const {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME} = process.env;
  return {
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: false,
    synchronize: true,
    entities: [
      "dist/**/**/**/*.entity{.ts,.js}",
      "dist/**/**/*.entity{.ts,.js}",
    ],
  };
}

export function TypeOrmDataSourceConfig(): DataSourceOptions {
  const {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME} = process.env;
  return {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "snappfood",
    synchronize: true,
    entities: [
      "dist/**/**/**/*.entity{.ts,.js}",
      "dist/**/**/*.entity{.ts,.js}",
    ],
  };
}
