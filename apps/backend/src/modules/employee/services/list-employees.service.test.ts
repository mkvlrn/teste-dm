/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: big describe */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { EmployeeQuerySchema } from "@repo/schemas/query";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { ListEmployeesService } from "#/modules/employee/services/list-employees.service";

describe("ListEmployeesService", () => {
  let service: ListEmployeesService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new ListEmployeesService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("lists employees with pagination", async () => {
    mockPrisma.employee.count.mockResolvedValue(2);
    mockPrisma.employee.findMany.mockResolvedValue([
      {
        id: "1",
        name: "Alice Silva",
        cpf: "11111111111",
        dateOfBirth: new Date("1985-05-15"),
        jobTitle: "Manager",
        active: true,
      },
      {
        id: "2",
        name: "Bob Santos",
        cpf: "22222222222",
        dateOfBirth: new Date("1990-01-01"),
        jobTitle: "Developer",
        active: false,
      },
    ]);

    const query: EmployeeQuerySchema = { page: 1, limit: 10, active: "all" };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value.totalItems, 2);
    assert.strictEqual(result.value.page, 1);
    assert.strictEqual(result.value.limit, 10);
    assert.strictEqual(result.value.data.length, 2);
  });

  test("filters active employees", async () => {
    mockPrisma.employee.count.mockResolvedValue(1);
    mockPrisma.employee.findMany.mockResolvedValue([
      {
        id: "1",
        name: "Alice Silva",
        cpf: "11111111111",
        dateOfBirth: new Date("1985-05-15"),
        jobTitle: "Manager",
        active: true,
      },
    ]);

    const query = { page: 1, limit: 10, active: "true" as const };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value.totalItems, 1);
    assert.isTrue(result.value.data[0]?.active);
  });

  test("searches employees by query", async () => {
    mockPrisma.employee.count.mockResolvedValue(1);
    mockPrisma.employee.findMany.mockResolvedValue([
      {
        id: "1",
        name: "Alice Silva",
        cpf: "11111111111",
        dateOfBirth: new Date("1985-05-15"),
        jobTitle: "Manager",
        active: true,
      },
    ]);

    const query: EmployeeQuerySchema = { page: 1, limit: 10, q: "Alice", active: "all" };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value.data[0]?.name, "Alice Silva");
  });

  test("returns empty result when no employees match", async () => {
    mockPrisma.employee.count.mockResolvedValue(0);
    mockPrisma.employee.findMany.mockResolvedValue([]);

    const query: EmployeeQuerySchema = { page: 1, limit: 10, active: "all" };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value?.totalItems, 0);
    assert.deepStrictEqual(result.value.data, []);
  });

  describe("error when", () => {
    test("prisma throws while counting employees", async () => {
      mockPrisma.employee.count.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const query: EmployeeQuerySchema = { page: 1, limit: 10, active: "all" };
      const result = await service.run(query);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while finding employees", async () => {
      mockPrisma.employee.count.mockResolvedValue(2);
      mockPrisma.employee.findMany.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const query: EmployeeQuerySchema = { page: 1, limit: 10, active: "all" };
      const result = await service.run(query);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
