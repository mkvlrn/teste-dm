import { Global, Module } from "@nestjs/common";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Global()
@Module({
  imports: [],
  exports: [PrismaProvider],
  providers: [PrismaProvider],
  controllers: [],
})
export class GlobalModule {}
