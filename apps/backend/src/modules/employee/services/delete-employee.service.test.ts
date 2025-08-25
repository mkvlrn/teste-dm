import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { DeleteEmployeeService } from "#/modules/employee/services/delete-employee.service";

describe("DeleteEmployeeService", () => {
  const validId = "507f1f77bcf86cd799439011";

  let service: DeleteEmployeeService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new DeleteEmployeeService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("deletes an employee", async () => {
    mockPrisma.employee.findUnique.mockResolvedValue({
      id: validId,
      name: "John Doe",
      cpf: "12345678900",
      dateOfBirth: new Date("1990-01-01"),
      jobTitle: "Software Engineer",
      active: true,
    });

    mockPrisma.employee.delete.mockResolvedValue({
      id: validId,
    } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.delete>>);

    const result = await service.run(validId);

    assert.isUndefined(result.error);
    assert.isUndefined(result.value);
  });

  describe("error when", () => {
    test("employee not found", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      const expectedError = new AppError(
        "NotFoundError",
        ErrorCodes.domain.employee.notFound,
        HttpStatus.NOT_FOUND,
      );

      const result = await service.run(validId);

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

      const result = await service.run(validId);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while deleting employee", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue({
        id: validId,
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);

      mockPrisma.employee.delete.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
