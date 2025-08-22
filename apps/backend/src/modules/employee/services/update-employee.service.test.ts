/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CreateEmployeeSchema } from "@repo/schemas/employee";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { UpdateEmployeeService } from "#/modules/employee/services/update-employee.service";

describe("UpdateEmployeeService", () => {
  const validId = "507f1f77bcf86cd799439011";
  const validInput: CreateEmployeeSchema = {
    name: "John Updated",
    cpf: "98765432100",
    dateOfBirth: "1990-01-01",
    jobTitle: "Senior Engineer",
  };

  let service: UpdateEmployeeService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new UpdateEmployeeService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("updates an employee", async () => {
    mockPrisma.employee.findUnique
      .mockResolvedValueOnce({
        id: validId,
        cpf: "12345678900",
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>)
      .mockResolvedValueOnce(null);

    mockPrisma.employee.update.mockResolvedValue({
      id: validId,
      name: "John Updated",
      cpf: "98765432100",
      dateOfBirth: new Date("1990-01-01"),
      jobTitle: "Senior Engineer",
      active: true,
    });

    const result = await service.run(validId, validInput);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, {
      id: validId,
      name: "John Updated",
      cpf: "98765432100",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      jobTitle: "Senior Engineer",
      active: true,
    });
  });

  test("updates employee keeping same cpf", async () => {
    const inputSameCpf = { ...validInput, cpf: "12345678900" };
    mockPrisma.employee.findUnique
      .mockResolvedValueOnce({
        id: validId,
        cpf: "12345678900",
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>)
      .mockResolvedValueOnce({
        id: validId,
        cpf: "12345678900",
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);

    mockPrisma.employee.update.mockResolvedValue({
      id: validId,
      name: "John Updated",
      cpf: "12345678900",
      dateOfBirth: new Date("1990-01-01"),
      jobTitle: "Senior Engineer",
      active: true,
    });

    const result = await service.run(validId, inputSameCpf);

    assert.isUndefined(result.error);
  });

  describe("error when", () => {
    test("employee not found", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      const expectedError = new AppError(
        "NotFoundError",
        ErrorCodes.domain.employee.notFound,
        HttpStatus.NOT_FOUND,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("cpf already in use by another employee", async () => {
      mockPrisma.employee.findUnique
        .mockResolvedValueOnce({
          id: validId,
        } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>)
        .mockResolvedValueOnce({
          id: "differentId",
          cpf: validInput.cpf,
        } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);

      const expectedError = new AppError(
        "ConflictError",
        ErrorCodes.domain.employeeUpdate.cpfAlreadyInUse,
        HttpStatus.CONFLICT,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking employee existence", async () => {
      mockPrisma.employee.findUnique.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking cpf availability", async () => {
      mockPrisma.employee.findUnique
        .mockResolvedValueOnce({
          id: validId,
        } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>)
        .mockRejectedValueOnce(new Error("mock error"));

      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while updating employee", async () => {
      mockPrisma.employee.findUnique
        .mockResolvedValueOnce({
          id: validId,
        } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>)
        .mockResolvedValueOnce(null);

      mockPrisma.employee.update.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employeeUpdate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
