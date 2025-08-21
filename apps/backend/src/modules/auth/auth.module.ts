import { Module } from "@nestjs/common";
import { AuthController } from "#/modules/auth/auth.controller";
import { LoginService } from "#/modules/auth/services/login.service";
import { RegisterService } from "#/modules/auth/services/register.service";
import { auth } from "#/utils/auth";
import { betterAuthSymbol } from "#/utils/symbols";

@Module({
  imports: [],
  exports: [],
  providers: [RegisterService, LoginService, { provide: betterAuthSymbol, useValue: auth }],
  controllers: [AuthController],
})
export class AuthModule {}
