import type { IncomingHttpHeaders } from "node:http";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { UserEntity } from "@repo/schemas/user";
import type { Auth, Session } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "#/app/app-error";
import { betterAuthSymbol } from "#/shared/utils/symbols";

@Injectable()
export class MeService {
  @Inject(betterAuthSymbol) private readonly authService: Auth;

  constructor(authService: Auth) {
    this.authService = authService;
  }

  async run(headers: IncomingHttpHeaders): AsyncResult<[Session, UserEntity], AppError> {
    try {
      const sessionData = await this.authService.api.getSession({
        headers: fromNodeHeaders(headers),
      });

      if (!sessionData) {
        const error = new AppError(
          "AuthenticationError",
          ErrorCodes.domain.userAuth.noSession,
          HttpStatus.UNAUTHORIZED,
        );
        return R.error(error);
      }

      const { session, user } = sessionData;
      const { id, name, email } = user;
      return R.ok([session, { id, name, email }]);
    } catch (err) {
      const error = new AppError(
        "AuthenticationError",
        `${ErrorCodes.domain.userAuth.noSession}: ${(err as Error).message}`,
        HttpStatus.UNAUTHORIZED,
      );
      return R.error(error);
    }
  }
}
