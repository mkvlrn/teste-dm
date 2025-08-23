import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { EmployeeEntity } from "@repo/schemas/employee";
import type { EmployeeQuerySchema } from "@repo/schemas/query";
import { AppError } from "#/app/app-error";
import type { Prisma } from "#/generated/prisma/client";
import { PrismaProvider } from "#/global/providers/prisma.provider";
import { PaginatedResult } from "#/shared/utils/paginated-result";

@Injectable()
export class ListEmployeesService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(query: EmployeeQuerySchema): AsyncResult<PaginatedResult<EmployeeEntity>, AppError> {
    try {
      const { page, limit } = query;
      const where = this.parseQuery(query);
      const totalItems = await this.prisma.employee.count({ where });
      const employees = await this.prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const data = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        cpf: employee.cpf,
        dateOfBirth: employee.dateOfBirth.toISOString(),
        jobTitle: employee.jobTitle,
        active: employee.active,
      }));

      return R.ok(new PaginatedResult<EmployeeEntity>(totalItems, limit, page, data));
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }

  private parseQuery(query: EmployeeQuerySchema): Prisma.EmployeeWhereInput {
    const where: Prisma.EmployeeWhereInput = {};

    if (query.active && query.active !== "all") {
      where.active = query.active === "true";
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { cpf: { contains: query.q, mode: "insensitive" } },
        { jobTitle: { contains: query.q, mode: "insensitive" } },
      ];
    }

    return where;
  }
}
