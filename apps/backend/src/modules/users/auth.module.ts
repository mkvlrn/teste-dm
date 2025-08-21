import { Module } from "@nestjs/common";
import { AuthController } from "#/modules/users/auth.controller";

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
