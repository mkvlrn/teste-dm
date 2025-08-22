import type { IncomingHttpHeaders } from "node:http";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import { AppError } from "#/app/app-error";
import { type BetterAuthInstance, betterAuthSymbol } from "#/utils/symbols";

@Injectable()
export class LogoutService {
  @Inject(betterAuthSymbol) private readonly authService: BetterAuthInstance;

  constructor(authService: BetterAuthInstance) {
    this.authService = authService;
  }

  async run(headers: IncomingHttpHeaders): AsyncResult<string[], AppError> {
    try {
      const response = await this.authService.api.signOut({
        headers,
        asResponse: true,
      });

      const setCookie = response.headers.get("set-cookie") ?? "";
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

      return R.ok(cookies);
    } catch (err) {
      return R.error(
        new AppError(
          "InternalError",
          `${ErrorCodes.domain.userAuth.logoutError}: ${(err as Error).message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
