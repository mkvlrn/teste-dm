import {
  type CanActivate,
  type ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { ErrorCodes } from "@repo/error-codes";
import type { Auth } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { AppError } from "#/app/app-error";
import { betterAuthSymbol } from "#/utils/symbols";

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(betterAuthSymbol) private readonly authService: Auth;

  constructor(authService: Auth) {
    this.authService = authService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = await this.authService.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    request.session = session;
    request.user = session?.user ?? null;

    if (!session) {
      throw new AppError(
        "AuthenticationError",
        ErrorCodes.domain.userAuth.noSession,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
