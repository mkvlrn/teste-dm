import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CertificateEntity, CreateCertificateSchema } from "@repo/schemas/certificate";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class CreateCertificateService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(input: CreateCertificateSchema): AsyncResult<CertificateEntity, AppError> {
    const employeeExists = await this.employeeExists(input.employeeId);
    if (employeeExists.error) {
      return R.error(employeeExists.error);
    }

    return this.create(input);
  }

  private async create(input: CreateCertificateSchema): AsyncResult<CertificateEntity, AppError> {
    try {
      const certificate = await this.prisma.certificate.create({
        data: {
          employeeId: input.employeeId,
          days: input.days,
          cid: input.cid,
          observations: input.observations ?? "",
        },
      });

      return R.ok({
        id: certificate.id,
        employeeId: certificate.employeeId,
        issuedAt: certificate.issuedAt.toISOString(),
        days: certificate.days,
        cid: certificate.cid,
        observations: certificate.observations,
      });
    } catch (err) {
      const msg = `${ErrorCodes.domain.certificateCreation.databaseError}: ${(err as Error).message}`;
      const error = new AppError("InternalError", msg, HttpStatus.INTERNAL_SERVER_ERROR);
      return R.error(error);
    }
  }

  private async employeeExists(employeeId: string): AsyncResult<true, AppError> {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
      if (!employee) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.certificateCreation.employeeNotFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      return R.ok(true);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificateCreation.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
