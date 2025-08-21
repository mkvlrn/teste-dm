import { Module } from "@nestjs/common";
import { AuthModule } from "#/modules/auth/auth.module";
import { SharedModule } from "#/shared/shared.module";

@Module({
  imports: [SharedModule, AuthModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
