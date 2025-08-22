import { Module } from "@nestjs/common";
import { GlobalModule } from "#/global/global.module";
import { AuthModule } from "#/modules/auth/auth.module";
import { EmployeeModule } from "#/modules/employee/employee.module";

@Module({
  imports: [GlobalModule, AuthModule, EmployeeModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
