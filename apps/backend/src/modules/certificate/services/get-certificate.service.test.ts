/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { GetCertificateService } from "#/modules/certificate/services/get-certificate.service";

describe("GetCertificateService", () => {
  const validId = "507f1f77bcf86cd799439011";

  let service: GetCertificateService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new GetCertificateService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("gets a certificate", async () => {
    mockPrisma.certificate.findUnique.mockResolvedValue({
      id: validId,
      employeeId: "507f1f77bcf86cd799439022",
      issuedAt: new Date("2024-01-01T10:00:00.000Z"),
      days: 5,
      cid: "123456",
      observations: "Medical leave",
    });

    const result = await service.run(validId);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, {
      id: validId,
      employeeId: "507f1f77bcf86cd799439022",
      issuedAt: "2024-01-01T10:00:00.000Z",
      days: 5,
      cid: "123456",
      observations: "Medical leave",
    });
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

    test("prisma throws while fetching certificate", async () => {
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
  });
});
