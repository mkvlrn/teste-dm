import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { EmployeeEntity, UpdateEmployeeSchema } from "@repo/schemas/employee";
import { AppError } from "#/app/app-error";
import type { Prisma } from "#/generated/prisma/client";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class UpdateEmployeeService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(id: string, input: UpdateEmployeeSchema): AsyncResult<EmployeeEntity, AppError> {
    const employeeExists = await this.employeeExists(id);
    if (employeeExists.error) {
      return R.error(employeeExists.error);
    }

    if (input.cpf) {
      const isCpfAvailable = await this.isCpfAvailable(id, input.cpf);
      if (isCpfAvailable.error) {
        return R.error(isCpfAvailable.error);
      }
    }

    return this.update(id, input);
  }

  private async update(
    id: string,
    input: UpdateEmployeeSchema,
  ): AsyncResult<EmployeeEntity, AppError> {
    try {
      const employee = await this.prisma.employee.update({
        where: { id },
        data: this.createUpdateData(input),
      });

      return R.ok({
        id: employee.id,
        name: employee.name,
        cpf: employee.cpf,
        dateOfBirth: employee.dateOfBirth.toISOString(),
        jobTitle: employee.jobTitle,
        active: employee.active,
      });
    } catch (err) {
      const msg = `${ErrorCodes.domain.employeeUpdate.databaseError}: ${(err as Error).message}`;
      const error = new AppError("InternalError", msg, HttpStatus.INTERNAL_SERVER_ERROR);
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

  private async isCpfAvailable(id: string, cpf: string): AsyncResult<true, AppError> {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { cpf } });
      if (employee && employee.id !== id) {
        const error = new AppError(
          "ConflictError",
          ErrorCodes.domain.employeeUpdate.cpfAlreadyInUse,
          HttpStatus.CONFLICT,
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

  private createUpdateData(input: UpdateEmployeeSchema): Prisma.EmployeeUpdateInput {
    const updateFields = {
      name: input.name,
      cpf: input.cpf,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      jobTitle: input.jobTitle,
      active: input.active,
    };

    return Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined),
    ) as Prisma.EmployeeUpdateInput;
  }
}
