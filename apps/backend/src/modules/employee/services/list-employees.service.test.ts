/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
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

  test("lists all employees", async () => {
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

    const result = await service.run();

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, [
      {
        id: "1",
        name: "Alice Silva",
        cpf: "11111111111",
        dateOfBirth: "1985-05-15T00:00:00.000Z",
        jobTitle: "Manager",
        active: true,
      },
      {
        id: "2",
        name: "Bob Santos",
        cpf: "22222222222",
        dateOfBirth: "1990-01-01T00:00:00.000Z",
        jobTitle: "Developer",
        active: false,
      },
    ]);
  });

  test("returns empty array when no employees", async () => {
    mockPrisma.employee.findMany.mockResolvedValue([]);

    const result = await service.run();

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, []);
  });

  describe("error when", () => {
    test("prisma throws while listing employees", async () => {
      mockPrisma.employee.findMany.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.employee.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run();

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
