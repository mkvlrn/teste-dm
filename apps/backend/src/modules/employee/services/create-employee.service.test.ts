import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CreateEmployeeSchema } from "@repo/schemas/employee";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { CreateEmployeeService } from "#/modules/employee/services/create-employee.service";

describe("CreateEmployeeService", () => {
  const validInput: CreateEmployeeSchema = {
    name: "John Doe Silva",
    cpf: "12345678900",
    dateOfBirth: "1990-01-01",
    jobTitle: "Software Engineer",
  };

  let service: CreateEmployeeService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new CreateEmployeeService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("creates an employee", async () => {
    mockPrisma.employee.findUnique.mockResolvedValue(null);
    mockPrisma.employee.create.mockResolvedValue({
      id: "1",
      name: "John Doe Silva",
      cpf: "12345678900",
      dateOfBirth: new Date("1990-01-01"),
      jobTitle: "Software Engineer",
      active: true,
    });

    const result = await service.run(validInput);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, {
      id: "1",
      name: "John Doe Silva",
      cpf: "12345678900",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      jobTitle: "Software Engineer",
      active: true,
    });
  });

  describe("error when", () => {
    test("cpf is not unique", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue({
        cpf: "12345678900",
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);
      const expectedError = new AppError(
        "ConflictError",
        ErrorCodes.domain.employeeCreation.cpfAlreadyInUse,
        HttpStatus.CONFLICT,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking for cpf uniqueness", async () => {
      mockPrisma.employee.findUnique.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employeeCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while creating employee", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      mockPrisma.employee.create.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employeeCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
