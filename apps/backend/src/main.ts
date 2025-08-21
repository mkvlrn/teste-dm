import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "#/app/app.module";
import { env } from "#/app/env";

const app = await NestFactory.create(AppModule);

await app.listen(env.port, () => {
  Logger.log(`Listening on port ${env.port}`, "DEBUG");
});
