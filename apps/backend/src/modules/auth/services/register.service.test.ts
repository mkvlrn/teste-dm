/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: describes are HUGE */
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { CreateUserSchema } from "@repo/schemas/user";
import { APIError } from "better-auth/api";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import { RegisterService } from "#/modules/auth/services/register.service";
import type { PrismaProvider } from "#/shared/providers/prisma.provider";
import type { BetterAuthInstance } from "#/utils/symbols";

describe("RegisterService", () => {
  const validInput: CreateUserSchema = {
    name: "John Doe",
    email: "john.doe@email.com",
    password: "@ValidPassword123",
  };

  let service: RegisterService;
  let mockPrisma: DeepMockProxy<PrismaProvider>;
  let mockAuthService: DeepMockProxy<BetterAuthInstance>;

  beforeEach(() => {
    mockPrisma = mockDeep();
    mockAuthService = mockDeep();
    service = new RegisterService(mockPrisma, mockAuthService);
  });

  afterEach(() => {
    mockReset(mockPrisma);
    mockReset(mockAuthService);
  });

  test("creates an user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockAuthService.api.signUpEmail.mockResolvedValue({
      response: { user: { id: "1", name: "John Doe", email: "john.doe@email.com" } },
      headers: new Headers([["set-cookie", "mockCookie"]]),
    } as unknown as Awaited<ReturnType<typeof mockAuthService.api.signUpEmail>>);

    const result = await service.run(validInput);

    assert.isUndefined(result.error);
    const [resultUser, resultCookie] = result.value;
    assert.deepStrictEqual(resultUser, { id: "1", name: "John Doe", email: "john.doe@email.com" });
    assert.strictEqual(resultCookie, "mockCookie");
  });

  describe("error when", () => {
    test("email is not unique", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: "john.doe@email.com",
      } as unknown as Awaited<ReturnType<typeof mockPrisma.user.findUnique>>);
      const expectedError = new AppError(
        "ConflictError",
        ErrorCodes.domain.userCreation.emailAlreadyInUse,
        HttpStatus.CONFLICT,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("prisma throws while checking for email uniqueness", async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.userCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("better-auth throws while registering user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockAuthService.api.signUpEmail.mockRejectedValue(
        new APIError("BAD_GATEWAY", { message: "mock error" }),
      );
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.userCreation.databaseError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("better-auth throws in some other way", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockAuthService.api.signUpEmail.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        ErrorCodes.domain.userCreation.databaseError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
