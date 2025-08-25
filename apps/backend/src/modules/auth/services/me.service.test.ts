import type { IncomingHttpHeaders } from "node:http";
import { HttpStatus } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { Auth, Session } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { afterEach, assert, beforeEach, describe, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { AppError } from "#/app/app-error";
import { MeService } from "#/modules/auth/services/me.service";

describe("MeService", () => {
  const validHeaders: IncomingHttpHeaders = {
    authorization: "Bearer mockToken",
    cookie: "sessionCookie=mockSessionCookie",
  };

  const mockSession: Session = {
    id: "session-1",
    userId: "user-1",
    expiresAt: new Date("2025-01-01"),
    token: "mockToken",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  };

  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@email.com",
    emailVerified: true,
    image: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  let service: MeService;
  let mockAuthService: DeepMockProxy<Auth>;

  beforeEach(() => {
    mockAuthService = mockDeep();
    service = new MeService(mockAuthService);
  });

  afterEach(() => {
    mockReset(mockAuthService);
  });

  test("returns session and user data when authenticated", async () => {
    mockAuthService.api.getSession.mockResolvedValue({
      session: mockSession,
      user: mockUser,
    } as unknown as Awaited<ReturnType<typeof mockAuthService.api.getSession>>);

    const result = await service.run(validHeaders);

    assert.isUndefined(result.error);
    const [resultSession, resultUser] = result.value;
    assert.deepStrictEqual(resultSession, mockSession);
    assert.deepStrictEqual(resultUser, {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@email.com",
    });
    assert.strictEqual(mockAuthService.api.getSession.mock.calls.length, 1);
    assert.deepStrictEqual(mockAuthService.api.getSession.mock.calls[0], [
      {
        headers: fromNodeHeaders(validHeaders),
      },
    ]);
  });

  describe("error when", () => {
    test("no session is found", async () => {
      mockAuthService.api.getSession.mockResolvedValue(null);
      const expectedError = new AppError(
        "AuthenticationError",
        ErrorCodes.domain.userAuth.noSession,
        HttpStatus.UNAUTHORIZED,
      );

      const result = await service.run(validHeaders);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("better-auth throws while getting session", async () => {
      mockAuthService.api.getSession.mockRejectedValue(new Error("Session expired"));
      const expectedError = new AppError(
        "AuthenticationError",
        `${ErrorCodes.domain.userAuth.noSession}: Session expired`,
        HttpStatus.UNAUTHORIZED,
      );

      const result = await service.run(validHeaders);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });

    test("better-auth throws with network error", async () => {
      mockAuthService.api.getSession.mockRejectedValue(new Error("Network error"));
      const expectedError = new AppError(
        "AuthenticationError",
        `${ErrorCodes.domain.userAuth.noSession}: Network error`,
        HttpStatus.UNAUTHORIZED,
      );

      const result = await service.run(validHeaders);

      assert.isDefined(result.error);
      assert.deepStrictEqual(result.error, expectedError);
    });
  });

  test("handles empty headers", async () => {
    mockAuthService.api.getSession.mockResolvedValue(null);
    const emptyHeaders: IncomingHttpHeaders = {};
    const expectedError = new AppError(
      "AuthenticationError",
      ErrorCodes.domain.userAuth.noSession,
      HttpStatus.UNAUTHORIZED,
    );

    const result = await service.run(emptyHeaders);

    assert.isDefined(result.error);
    assert.deepStrictEqual(result.error, expectedError);
  });
});
