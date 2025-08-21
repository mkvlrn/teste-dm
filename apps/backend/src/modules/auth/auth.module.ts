import { Module } from "@nestjs/common";
import { AuthController } from "#/modules/auth/auth.controller";

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
