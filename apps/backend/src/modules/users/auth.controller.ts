import { Controller } from "@nestjs/common";
import type { AuthService } from "@thallesp/nestjs-better-auth";
import type { auth } from "#/utils/auth";

@Controller("auth")
export class AuthController {
  private readonly authService: AuthService<typeof auth>;

  constructor(authService: AuthService<typeof auth>) {
    this.authService = authService;
  }
}
