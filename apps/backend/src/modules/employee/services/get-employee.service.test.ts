/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { GetEmployeeService } from "#/modules/employee/services/get-employee.service";

describe("GetEmployeeService", () => {
  const validId = "507f1f77bcf86cd799439011";

  let service: GetEmployeeService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new GetEmployeeService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("gets an employee", async () => {
    mockPrisma.employee.findUnique.mockResolvedValue({
      id: validId,
      name: "John Doe Silva",
      cpf: "12345678900",
      dateOfBirth: new Date("1990-01-01"),
      jobTitle: "Software Engineer",
      active: true,
    });

    const result = await service.run(validId);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, {
      id: validId,
      name: "John Doe Silva",
      cpf: "12345678900",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
      jobTitle: "Software Engineer",
      active: true,
    });
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

    test("prisma throws while fetching employee", async () => {
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
  });
});
