import { Injectable, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "#/generated/prisma/client";
import type { LogOptions } from "#/generated/prisma/internal/class";
import type { PrismaClientOptions } from "#/generated/prisma/internal/prismaNamespace";

// https://github.com/prisma/prisma/issues/27894#issuecomment-3193490956
class ConfiguredPrismaClient extends PrismaClient<
  PrismaClientOptions,
  LogOptions<PrismaClientOptions>
> {}

@Injectable()
export class PrismaProvider extends ConfiguredPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
