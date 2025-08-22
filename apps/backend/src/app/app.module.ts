import { Module } from "@nestjs/common";
import { GlobalModule } from "#/global/global.module";
import { AuthModule } from "#/modules/auth/auth.module";

@Module({
  imports: [GlobalModule, AuthModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
