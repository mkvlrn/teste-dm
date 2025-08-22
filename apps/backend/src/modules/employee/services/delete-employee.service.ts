import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class DeleteEmployeeService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(id: string): AsyncResult<void, AppError> {
    const employeeExists = await this.employeeExists(id);
    if (employeeExists.error) {
      return R.error(employeeExists.error);
    }

    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.employee.notFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      await this.prisma.employee.delete({
        where: { id },
      });

      return R.ok(undefined);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }

  private async employeeExists(id: string): AsyncResult<true, AppError> {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { id } });
      if (!employee) {
        const error = new AppError(
          "NotFoundError",
          ErrorCodes.domain.employee.notFound,
          HttpStatus.NOT_FOUND,
        );
        return R.error(error);
      }

      return R.ok(true);
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
