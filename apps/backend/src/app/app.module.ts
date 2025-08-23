import { Module } from "@nestjs/common";
import { GlobalModule } from "#/global/global.module";
import { AuthModule } from "#/modules/auth/auth.module";
import { CertificateModule } from "#/modules/certificate/certificate.module";
import { EmployeeModule } from "#/modules/employee/employee.module";

@Module({
  imports: [GlobalModule, AuthModule, EmployeeModule, CertificateModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
