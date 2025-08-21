import { Global, Module } from "@nestjs/common";
import { PrismaProvider } from "#/shared/providers/prisma.provider";

@Global()
@Module({
  imports: [],
  exports: [PrismaProvider],
  providers: [PrismaProvider],
  controllers: [],
})
export class SharedModule {}
