import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { LoginSchema, User } from "@repo/schemas/user";
import { APIError } from "better-auth/api";
import { AppError } from "#/app/app-error";
import { type BetterAuthInstance, betterAuthSymbol } from "#/utils/symbols";

@Injectable()
export class LoginService {
  @Inject(betterAuthSymbol) private readonly authService: BetterAuthInstance;

  constructor(authService: BetterAuthInstance) {
    this.authService = authService;
  }

  async run(input: LoginSchema): AsyncResult<[User, string], AppError> {
    return await this.login(input);
  }

  private async login(input: LoginSchema): AsyncResult<[User, string], AppError> {
    try {
      const authUser = await this.authService.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
        returnHeaders: true,
      });
      const { id, name, email } = authUser.response.user;
      const authCookie = authUser.headers.get("set-cookie") ?? "";

      return R.ok([{ id, name, email }, authCookie]);
    } catch (err) {
      if (err instanceof APIError) {
        const error = new AppError(
          "AuthenticationError",
          `${ErrorCodes.domain.userCreation.databaseError}: ${err.message}`,
          err.statusCode,
        );
        return R.error(error);
      }

      const error = new AppError(
        "InternalError",
        ErrorCodes.domain.userCreation.databaseError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
