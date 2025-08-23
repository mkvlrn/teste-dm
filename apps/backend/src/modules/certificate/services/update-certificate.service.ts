import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CertificateEntity, UpdateCertificateSchema } from "@repo/schemas/certificate";
import { AppError } from "#/app/app-error";
import type { Prisma } from "#/generated/prisma/client";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class UpdateCertificateService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(id: string, input: UpdateCertificateSchema): AsyncResult<CertificateEntity, AppError> {
    const certificateExists = await this.certificateExists(id);
    if (certificateExists.error) {
      return R.error(certificateExists.error);
    }

    return this.update(id, input);
  }

  private async update(
    id: string,
    input: UpdateCertificateSchema,
  ): AsyncResult<CertificateEntity, AppError> {
    try {
      const certificate = await this.prisma.certificate.update({
        where: { id },
        data: this.createUpdateData(input),
      });

      return R.ok({
        id: certificate.id,
        employeeId: certificate.employeeId,
        issuedAt: certificate.issuedAt.toISOString(),
        days: certificate.days,
        cid: certificate.cid,
        observations: certificate.observations ?? undefined,
      });
    } catch (err) {
      const msg = `${ErrorCodes.domain.certificateUpdate.databaseError}: ${(err as Error).message}`;
      const error = new AppError("InternalError", msg, HttpStatus.INTERNAL_SERVER_ERROR);
      return R.error(error);
    }
  }

  private async certificateExists(id: string): AsyncResult<true, AppError> {
    try {
      const certificate = await this.prisma.certificate.findUnique({ where: { id } });
      if (!certificate) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.certificate.notFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      return R.ok(true);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }

  private createUpdateData(input: UpdateCertificateSchema): Prisma.CertificateUpdateInput {
    const updateFields = {
      days: input.days,
      cid: input.cid,
      observations: input.observations,
    };

    return Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined),
    ) as Prisma.CertificateUpdateInput;
  }
}
