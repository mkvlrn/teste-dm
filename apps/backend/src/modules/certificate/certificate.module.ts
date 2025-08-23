import { Module } from "@nestjs/common";
import { CertificateController } from "#/modules/certificate/certificate.controller";
import { CreateCertificateService } from "#/modules/certificate/services/create-certificate.service";
import { DeleteCertificateService } from "#/modules/certificate/services/delete-certificate.service";
import { GetCertificateService } from "#/modules/certificate/services/get-certificate.service";
import { ListCertificatesService } from "#/modules/certificate/services/list-certificates.service";
import { UpdateCertificateService } from "#/modules/certificate/services/update-certificate.service";

@Module({
  imports: [],
  exports: [],
  providers: [
    CreateCertificateService,
    GetCertificateService,
    ListCertificatesService,
    UpdateCertificateService,
    DeleteCertificateService,
  ],
  controllers: [CertificateController],
})
export class CertificateModule {}
