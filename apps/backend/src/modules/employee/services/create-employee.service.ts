import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CreateEmployeeSchema, EmployeeEntity } from "@repo/schemas/employee";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/global/providers/prisma.provider";

@Injectable()
export class CreateEmployeeService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;

  constructor(prisma: PrismaProvider) {
    this.prisma = prisma;
  }

  async run(input: CreateEmployeeSchema): AsyncResult<EmployeeEntity, AppError> {
    const isCpfInUse = await this.isCpfInUse(input.cpf);
    if (isCpfInUse.error) {
      return R.error(isCpfInUse.error);
    }

    return this.create(input);
  }

  private async create(input: CreateEmployeeSchema): AsyncResult<EmployeeEntity, AppError> {
    try {
      const employee = await this.prisma.employee.create({
        data: {
          name: input.name,
          cpf: input.cpf,
          dateOfBirth: new Date(input.dateOfBirth),
          jobTitle: input.jobTitle,
          active: true,
        },
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
      const msg = `${ErrorCodes.domain.employeeCreation.databaseError}: ${(err as Error).message}`;
      const error = new AppError("InternalError", msg, HttpStatus.INTERNAL_SERVER_ERROR);
      return R.error(error);
    }
  }

  private async isCpfInUse(cpf: string): AsyncResult<false, AppError> {
    try {
      const employee = await this.prisma.employee.findUnique({ where: { cpf } });
      if (employee) {
        const error = new AppError(
          "ConflictError",
          ErrorCodes.domain.employeeCreation.cpfAlreadyInUse,
          HttpStatus.CONFLICT,
        );
        return R.error(error);
      }

      return R.ok(false);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employeeCreation.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
