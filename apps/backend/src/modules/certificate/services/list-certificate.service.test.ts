import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CertificateQuerySchema } from "@repo/schemas/query";
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

  test("lists certificates with pagination", async () => {
    mockPrisma.certificate.count.mockResolvedValue(2);
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

    const query: CertificateQuerySchema = { page: 1, limit: 10 };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value?.totalItems, 2);
    assert.strictEqual(result.value?.page, 1);
    assert.strictEqual(result.value?.limit, 10);
    assert.strictEqual(result.value?.data.length, 2);
  });

  test("filters certificates by employeeId", async () => {
    mockPrisma.certificate.count.mockResolvedValue(1);
    mockPrisma.certificate.findMany.mockResolvedValue([
      {
        id: "1",
        employeeId: "emp1",
        issuedAt: new Date("2024-01-02T10:00:00.000Z"),
        days: 3,
        cid: "111111",
        observations: "Flu",
      },
    ]);

    const query: CertificateQuerySchema = { page: 1, limit: 10, employeeId: "emp1" };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value?.totalItems, 1);
    assert.strictEqual(result.value?.data[0]?.employeeId, "emp1");
  });

  test("searches certificates by query", async () => {
    mockPrisma.certificate.count.mockResolvedValue(1);
    mockPrisma.certificate.findMany.mockResolvedValue([
      {
        id: "1",
        employeeId: "emp1",
        issuedAt: new Date("2024-01-02T10:00:00.000Z"),
        days: 3,
        cid: "111111",
        observations: "Flu",
      },
    ]);

    const query: CertificateQuerySchema = { page: 1, limit: 10, q: "111111" };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value?.data[0]?.cid, "111111");
  });

  test("returns empty result when no certificates match", async () => {
    mockPrisma.certificate.count.mockResolvedValue(0);
    mockPrisma.certificate.findMany.mockResolvedValue([]);

    const query: CertificateQuerySchema = { page: 1, limit: 10 };
    const result = await service.run(query);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value?.totalItems, 0);
    assert.deepStrictEqual(result.value?.data, []);
  });

  describe("error when", () => {
    test("prisma throws while counting certificates", async () => {
      mockPrisma.certificate.count.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const query: CertificateQuerySchema = { page: 1, limit: 10 };
      const result = await service.run(query);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while finding certificates", async () => {
      mockPrisma.certificate.count.mockResolvedValue(2);
      mockPrisma.certificate.findMany.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const query: CertificateQuerySchema = { page: 1, limit: 10 };
      const result = await service.run(query);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
