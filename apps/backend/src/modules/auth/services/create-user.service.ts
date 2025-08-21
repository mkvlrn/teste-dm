import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import { type AsyncResult, R } from "@repo/result";
import type { CreateUserSchema, User } from "@repo/schemas/user";
import { AuthService } from "@thallesp/nestjs-better-auth";
import { APIError } from "better-auth/api";
import { AppError } from "#/app/app-error";
import { PrismaProvider } from "#/shared/providers/prisma.provider";
import type { auth } from "#/utils/auth";

@Injectable()
export class CreateUserService {
  @Inject(PrismaProvider) private readonly prisma: PrismaProvider;
  @Inject(AuthService) private readonly authService: AuthService<typeof auth>;

  constructor(prisma: PrismaProvider, authService: AuthService<typeof auth>) {
    this.prisma = prisma;
    this.authService = authService;
  }

  async run(input: CreateUserSchema): AsyncResult<[User, string], AppError> {
    const isEmailInUse = await this.isEmailInUse(input.email);
    if (isEmailInUse.error) {
      return R.error(isEmailInUse.error);
    }

    return this.register(input);
  }

  private async register(input: CreateUserSchema): AsyncResult<[User, string], AppError> {
    try {
      const authUser = await this.authService.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
        returnHeaders: true,
      });
      const { id, name, email } = authUser.response.user;
      const authCookie = authUser.headers.get("set-cookie") ?? "";

      return R.ok([{ id, name, email }, authCookie]);
    } catch (err) {
      const msg =
        err instanceof APIError
          ? `${ErrorCodes.domain.userCreation.databaseError}: ${err.message}`
          : ErrorCodes.domain.userCreation.databaseError;
      const error = new AppError("InternalError", msg, HttpStatus.INTERNAL_SERVER_ERROR);
      return R.error(error);
    }
  }

  private async isEmailInUse(email: string): AsyncResult<false, AppError> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        const error = new AppError(
          "ConflictError",
          ErrorCodes.domain.userCreation.emailAlreadyInUse,
          HttpStatus.CONFLICT,
        );
        return R.error(error);
      }

      return R.ok(false);
    } catch (err) {
      const error = new AppError(
        "InternalError",
        `${ErrorCodes.domain.userCreation.databaseError}: ${(err as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      return R.error(error);
    }
  }
}
