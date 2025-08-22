import type { IncomingHttpHeaders } from "node:http";
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import { LogoutService } from "#/modules/auth/services/logout.service";
import type { BetterAuthInstance } from "#/utils/symbols";

describe("LogoutService", () => {
  const validInput: IncomingHttpHeaders = {
    cookie: "session=mockSessionCookie",
  };

  let service: LogoutService;
  let mockAuthService: DeepMockProxy<BetterAuthInstance>;

  beforeEach(() => {
    mockAuthService = mockDeep();
    service = new LogoutService(mockAuthService);
  });

  afterEach(() => {
    mockReset(mockAuthService);
  });

  test("logs out a user", async () => {
    mockAuthService.api.signOut.mockResolvedValue({
      headers: new Headers([["set-cookie", "mockCookie"]]),
    } as unknown as Awaited<ReturnType<typeof mockAuthService.api.signOut>>);

    const result = await service.run(validInput);

    assert.isUndefined(result.error);
    assert.deepStrictEqual(result.value, ["mockCookie"]);
  });

  describe("error when", () => {
    test("better-auth throws in some way", async () => {
      mockAuthService.api.signOut.mockRejectedValue(new Error("mock error"));
      const expectedError = new AppError(
        "InternalError",
        `${ErrorCodes.domain.userAuth.logoutError}: mock error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      const result = await service.run(validInput);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });
});
