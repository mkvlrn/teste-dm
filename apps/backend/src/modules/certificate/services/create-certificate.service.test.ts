/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CreateCertificateSchema } from "@repo/schemas/certificate";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import type { PrismaProvider } from "#/global/providers/prisma.provider";
import { CreateCertificateService } from "#/modules/certificate/services/create-certificate.service";

describe("CreateCertificateService", () => {
  const validInput: CreateCertificateSchema = {
    employeeId: "507f1f77bcf86cd799439011",
    days: 5,
    cid: "123456",
    observations: "Medical leave",
  };

  let service: CreateCertificateService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    service = new CreateCertificateService(mockPrisma);
  });

  afterEach(() => {
    mockReset(mockPrisma);
  });

  test("creates a certificate", async () => {
    mockPrisma.employee.findUnique.mockResolvedValue({
      id: validInput.employeeId,
    } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);
    const issuedAt = new Date();

    mockPrisma.certificate.create.mockResolvedValue({
      id: "1",
      employeeId: validInput.employeeId,
      issuedAt,
      days: validInput.days,
      cid: validInput.cid,
      observations: validInput.observations,
    });

    const result = await service.run(validInput);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, {
      id: "1",
      employeeId: validInput.employeeId,
      issuedAt: issuedAt.toISOString(),
      days: validInput.days,
      cid: validInput.cid,
      observations: validInput.observations,
    });
  });

  describe("error when", () => {
    test("employee not found", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      const expectedError = new AppError(
        "NotFoundError",
        ErrorCodes.domain.certificateCreation.employeeNotFound,
        HttpStatus.NOT_FOUND,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking employee existence", async () => {
      mockPrisma.employee.findUnique.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificateCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while creating certificate", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue({
        id: validInput.employeeId,
      } as unknown as Awaited<ReturnType<typeof mockPrisma.employee.findUnique>>);

      mockPrisma.certificate.create.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.certificateCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
