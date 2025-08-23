/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { DeleteCertificateService } from "#/modules/certificate/services/delete-certificate.service";

describe("DeleteCertificateService", () => {
  const validId = "507f1f77bcf86cd799439011";

  let service: DeleteCertificateService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new DeleteCertificateService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("deletes a certificate", async () => {
    mockPrisma.certificate.findUnique.mockResolvedValue({
      id: validId,
      employeeId: "emp1",
      issuedAt: new Date("2024-01-01T10:00:00.000Z"),
      days: 5,
      cid: "123456",
      observations: "Medical leave",
    });

    mockPrisma.certificate.delete.mockResolvedValue({
      id: validId,
    } as unknown as Awaited<ReturnType<typeof mockPrisma.certificate.delete>>);

    const result = await service.run(validId);

    assert.isUndefined(result.error);
    assert.isUndefined(result.value);
  });

  describe("error when", () => {
    test("certificate not found", async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(null);
      const expectedError = new AppError(
        "NotFoundError",
        ErrorCodes.domain.certificate.notFound,
        HttpStatus.NOT_FOUND,
      );

      const result = await service.run(validId);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking certificate existence", async () => {
      mockPrisma.certificate.findUnique.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while deleting certificate", async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue({
        id: validId,
      } as unknown as Awaited<ReturnType<typeof mockPrisma.certificate.findUnique>>);

      mockPrisma.certificate.delete.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
