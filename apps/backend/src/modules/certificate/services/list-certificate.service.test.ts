/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { ListCertificatesService } from "#/modules/certificate/services/list-certificates.service";

describe("ListCertificatesService", () => {
  let service: ListCertificatesService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new ListCertificatesService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("lists all certificates", async () => {
    mockPrisma.certificate.findMany.mockResolvedValue([
      {
        id: "1",
        employeeId: "emp1",
        issuedAt: new Date("2024-01-02T10:00:00.000Z"),
        days: 3,
        cid: "111111",
        observations: "Flu",
      },
      {
        id: "2",
        employeeId: "emp2",
        issuedAt: new Date("2024-01-01T10:00:00.000Z"),
        days: 5,
        cid: "222222",
        observations: "",
      },
    ]);

    const result = await service.run();

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, [
      {
        id: "1",
        employeeId: "emp1",
        issuedAt: "2024-01-02T10:00:00.000Z",
        days: 3,
        cid: "111111",
        observations: "Flu",
      },
      {
        id: "2",
        employeeId: "emp2",
        issuedAt: "2024-01-01T10:00:00.000Z",
        days: 5,
        cid: "222222",
        observations: "",
      },
    ]);
  });

  test("returns empty array when no certificates", async () => {
    mockPrisma.certificate.findMany.mockResolvedValue([]);

    const result = await service.run();

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, []);
  });

  describe("error when", () => {
    test("prisma throws while listing certificates", async () => {
      mockPrisma.certificate.findMany.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run();

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
