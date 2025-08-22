import { Module } from "@nestjs/common";
import { AuthController } from "#/modules/auth/auth.controller";
import { LoginService } from "#/modules/auth/services/login.service";
import { LogoutService } from "#/modules/auth/services/logout.service";
import { MeService } from "#/modules/auth/services/me.service";
import { RegisterService } from "#/modules/auth/services/register.service";
import { auth } from "#/shared/utils/auth";
import { betterAuthSymbol } from "#/shared/utils/symbols";

@Module({
  imports: [],
  exports: [],
  providers: [
    RegisterService,
    LoginService,
    LogoutService,
    MeService,
    { provide: betterAuthSymbol, useValue: auth },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
