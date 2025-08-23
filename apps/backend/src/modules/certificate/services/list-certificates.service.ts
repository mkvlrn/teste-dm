import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CertificateEntity } from "@repo/schemas/certificate";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class ListCertificatesService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(): AsyncResult<CertificateEntity[], AppError> {
    try {
      const certificates = await this.prisma.certificate.findMany({
        orderBy: { issuedAt: "desc" },
      });

      const result = certificates.map((certificate) => ({
        id: certificate.id,
        employeeId: certificate.employeeId,
        issuedAt: certificate.issuedAt.toISOString(),
        days: certificate.days,
        cid: certificate.cid,
        observations: certificate.observations,
      }));

      return R.ok(result);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
