import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CertificateEntity } from "@repo/schemas/certificate";
import type { CertificateQuerySchema } from "@repo/schemas/query";
import { AppError } from "#/app/app-error";
import type { Prisma } from "#/generated/prisma/client";
import { PrismaProvider } from "#/global/providers/prisma.provider";
import { PaginatedResult } from "#/shared/utils/paginated-result";

@Injectable()
export class ListCertificatesService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(
    query: CertificateQuerySchema,
  ): AsyncResult<PaginatedResult<CertificateEntity>, AppError> {
    try {
      const { page, limit } = query;
      const where = this.parseQuery(query);
      const totalItems = await this.prisma.certificate.count({ where });
      const certificates = await this.prisma.certificate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const data = certificates.map((certificate) => ({
        id: certificate.id,
        employeeId: certificate.employeeId,
        issuedAt: certificate.issuedAt.toISOString(),
        days: certificate.days,
        cid: certificate.cid,
        observations: certificate.observations,
      }));

      return R.ok(new PaginatedResult<CertificateEntity>(totalItems, limit, page, data));
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }

  private parseQuery(query: CertificateQuerySchema): Prisma.CertificateWhereInput {
    const where: Prisma.CertificateWhereInput = {};

    if (query.employeeId) {
      where.employeeId = query.employeeId;
    }

    if (query.q) {
      where.OR = [
        { cid: { contains: query.q, mode: "insensitive" } },
        { observations: { contains: query.q, mode: "insensitive" } },
      ];
    }

    return where;
  }
}
