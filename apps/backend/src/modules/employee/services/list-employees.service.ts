import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { EmployeeEntity } from "@repo/schemas/employee";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class ListEmployeesService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(): AsyncResult<EmployeeEntity[], AppError> {
    try {
      const employees = await this.prisma.employee.findMany({
        orderBy: { name: "asc" },
      });

      const result = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        cpf: employee.cpf,
        dateOfBirth: employee.dateOfBirth.toISOString(),
        jobTitle: employee.jobTitle,
        active: employee.active,
      }));

      return R.ok(result);
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
