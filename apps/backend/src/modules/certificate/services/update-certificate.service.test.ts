/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CertificateEntity, UpdateCertificateSchema } from "@repo/schemas/certificate";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { UpdateCertificateService } from "#/modules/certificate/services/update-certificate.service";

describe("UpdateCertificateService", () => {
  const validId = "507f1f77bcf86cd799439011";
  const validInput: UpdateCertificateSchema = {
    days: 10,
    cid: "999999",
    observations: "Updated observation",
  };
  const validOutput: CertificateEntity = {
    id: validId,
    employeeId: "507f1f77bcf86cd799439022",
    issuedAt: "2024-01-15T10:00:00.000Z",
    days: 10,
    cid: "999999",
    observations: "Updated observation",
  };

  let service: UpdateCertificateService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new UpdateCertificateService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("updates a certificate", async () => {
    mockPrisma.certificate.findUnique.mockResolvedValue({
      id: validId,
    } as unknown as Awaited<ReturnType<typeof mockPrisma.certificate.findUnique>>);

    mockPrisma.certificate.update.mockResolvedValue({
      ...validOutput,
      issuedAt: new Date(validOutput.issuedAt),
    });

    const result = await service.run(validId, validInput);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, validOutput);
  });

  test("updates certificate with partial data", async () => {
    const partialInput: UpdateCertificateSchema = {
      days: 7,
      observations: "Partial update",
    };

    mockPrisma.certificate.findUnique.mockResolvedValue({
      id: validId,
    } as unknown as Awaited<ReturnType<typeof mockPrisma.certificate.findUnique>>);

    mockPrisma.certificate.update.mockResolvedValue({
      ...validOutput,
      issuedAt: new Date(validOutput.issuedAt),
      days: partialInput.days ?? 0,
      observations: partialInput.observations ?? "",
    });

    const result = await service.run(validId, partialInput);

    assert.isUndefined(result.error);
    assert.strictEqual(result.value.days, partialInput.days);
    assert.strictEqual(result.value.observations, partialInput.observations);
  });

  describe("error when", () => {
    test("certificate not found", async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue(null);
      const expectedError = new AppError(
        "NotFoundError",
        ErrorCodes.domain.certificate.notFound,
        HttpStatus.NOT_FOUND,
      );

      const result = await service.run(validId, validInput);

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

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while updating certificate", async () => {
      mockPrisma.certificate.findUnique.mockResolvedValue({
        id: validId,
      } as unknown as Awaited<ReturnType<typeof mockPrisma.certificate.findUnique>>);

      mockPrisma.certificate.update.mockRejectedValue(new Error("mock error"));

      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificateUpdate.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validId, validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
