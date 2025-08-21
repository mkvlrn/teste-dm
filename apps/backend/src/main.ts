import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "#/app/app.module";
import { env } from "#/app/env";
import { BetterAuthExceptionsFilter } from "#/filters/better-auth-exceptions.filter";

const app = await NestFactory.create(AppModule, {
  bodyParser: false,
});
app.useGlobalFilters(new BetterAuthExceptionsFilter());

await app.listen(env.port, () => {
  Logger.log(`Listening on port ${env.port}`, "DEBUG");
});
