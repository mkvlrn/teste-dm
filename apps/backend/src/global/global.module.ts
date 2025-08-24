import Keyv from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module, type Provider } from "@nestjs/common";
import { env } from "#/app/env";
import { PrismaProvider } from "#/global/providers/prisma.provider";
import { auth } from "#/shared/utils/auth";
import { axiosAuthSymbol, axiosSearchSymbol, betterAuthSymbol } from "#/shared/utils/symbols";
import { authClient, searchClient } from "#/shared/utils/who";

const BetterAuthProvider: Provider = { provide: betterAuthSymbol, useValue: auth };
const AxiosAuthProvider: Provider = { provide: axiosAuthSymbol, useValue: authClient };
const AxiosSearchProvider: Provider = { provide: axiosSearchSymbol, useValue: searchClient };

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      // @ts-expect-error incorrect type exported from Keyv
      useFactory: () => ({
        stores: [new Keyv(env.redisUrl)],
        ttl: 60 * 60 * 24 * 1000,
      }),
    }),
  ],
  exports: [PrismaProvider, BetterAuthProvider, AxiosAuthProvider, AxiosSearchProvider],
  providers: [PrismaProvider, BetterAuthProvider, AxiosAuthProvider, AxiosSearchProvider],
  controllers: [],
})
export class GlobalModule {}
