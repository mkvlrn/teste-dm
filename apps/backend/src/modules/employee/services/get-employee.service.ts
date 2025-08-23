import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CertificateEntity } from "@repo/schemas/certificate";
import type { EmployeeEntity } from "@repo/schemas/employee";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

type EmployeeWithCertificates = EmployeeEntity & { certificates: CertificateEntity[] };

@Injectable()
export class GetEmployeeService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(id: string): AsyncResult<EmployeeWithCertificates, AppError> {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
        include: { certificates: true },
      });

      if (!employee) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.employee.notFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      return R.ok({
        ...employee,
        dateOfBirth: employee.dateOfBirth.toISOString(),
        certificates: employee.certificates.map((cert) => ({
          ...cert,
          issuedAt: cert.issuedAt.toISOString(),
        })),
      });
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
