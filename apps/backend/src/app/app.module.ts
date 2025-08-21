import { Module } from "@nestjs/common";
import { AuthModule } from "#/modules/users/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
