import { Global, Module, type Provider } from "@nestjs/common";
import { PrismaProvider } from "#/global/providers/prisma.provider";
import { auth } from "#/shared/utils/auth";
import { betterAuthSymbol } from "#/shared/utils/symbols";

const BetterAuthProvider: Provider = { provide: betterAuthSymbol, useValue: auth };

@Global()
@Module({
  imports: [],
  exports: [PrismaProvider, BetterAuthProvider],
  providers: [PrismaProvider, BetterAuthProvider],
  controllers: [],
})
export class GlobalModule {}
