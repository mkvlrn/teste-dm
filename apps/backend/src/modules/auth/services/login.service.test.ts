import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { LoginSchema } from "@repo/schemas/user";
import type { Auth } from "better-auth";
import { APIError } from "better-auth/api";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import { LoginService } from "#/modules/auth/services/login.service";

describe("LoginService", () => {
  const validInput: LoginSchema = {
    email: "john.doe@email.com",
    password: "@ValidPassword123",
  };

  let service: LoginService;
  let mockAuthService: DeepMockProxy<Auth>;

  beforeEach(() => {
    mockAuthService = mockDeep();
    service = new LoginService(mockAuthService);
  });

  afterEach(() => {
    mockReset(mockAuthService);
  });

  test("logs in a user", async () => {
    mockAuthService.api.signInEmail.mockResolvedValue({
      response: { user: { id: "1", name: "John Doe", email: "john.doe@email.com" } },
      headers: new Headers([["set-cookie", "mockCookie"]]),
    } as unknown as Awaited<ReturnType<typeof mockAuthService.api.signInEmail>>);

    const result = await service.run(validInput);

    assert.isUndefined(result.error);
    const [resultUser, resultCookie] = result.value;
    assert.deepStrictEqual(resultUser, { id: "1", name: "John Doe", email: "john.doe@email.com" });
    assert.strictEqual(resultCookie, "mockCookie");
  });

  describe("error when", () => {
    test("better-auth throws API error while logging in", async () => {
      mockAuthService.api.signInEmail.mockRejectedValue(
        new APIError("UNAUTHORIZED", { message: "mock error" }),
      );
      const expectedError = new AppError(
        "AuthenticationError",
        `${ErrorCodes.domain.userCreation.databaseError}: mock error`,
        HttpStatus.UNAUTHORIZED,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("better-auth throws in some other way", async () => {
      mockAuthService.api.signInEmail.mockRejectedValue(new Error("mock error"));
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
