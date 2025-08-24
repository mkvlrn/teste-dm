// biome-ignore lint/correctness/noNodejsModules: it's fine
import process from "node:process";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "#/app/app.module";
import { env } from "#/app/env";
import { AppErrorFilter } from "#/shared/filters/app-error.filter";

const app = await NestFactory.create(AppModule);
app.enableCors();
app.useGlobalFilters(new AppErrorFilter());

process.on("SIGTERM", async () => {
  await app.close();
  process.exit(0);
});

await app.listen(env.port, () => {
  Logger.log(`Listening on port ${env.port}`, "DEBUG");
});
