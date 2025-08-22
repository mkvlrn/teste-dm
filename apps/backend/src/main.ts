import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "#/app/app.module";
import { env } from "#/app/env";
import { AppErrorFilter } from "#/shared/filters/app-error.filter";

const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new AppErrorFilter());

await app.listen(env.port, () => {
  Logger.log(`Listening on port ${env.port}`, "DEBUG");
});
