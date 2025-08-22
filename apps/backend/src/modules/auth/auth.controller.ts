import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CreateUserSchema, LoginSchema } from "@repo/schemas/user";
import type { Request, Response } from "express";
import { LoginService } from "#/modules/auth/services/login.service";
import { LogoutService } from "#/modules/auth/services/logout.service";
import { MeService } from "#/modules/auth/services/me.service";
import { RegisterService } from "#/modules/auth/services/register.service";
import { AuthGuard } from "#/shared/guards/auth.guard";
import { ZodValidator } from "#/shared/pipes/zod-validator.pipe";

@Controller("auth")
export class AuthController {
  @Inject(RegisterService) private readonly registerService: RegisterService;
  @Inject(LoginService) private readonly loginService: LoginService;
  @Inject(LogoutService) private readonly logoutService: LogoutService;
  @Inject(MeService) private readonly meService: MeService;

  constructor(
    registerService: RegisterService,
    loginService: LoginService,
    logoutService: LogoutService,
    meService: MeService,
  ) {
    this.registerService = registerService;
    this.loginService = loginService;
    this.logoutService = logoutService;
    this.meService = meService;
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidator(CreateUserSchema)) input: CreateUserSchema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.registerService.run(input);
    if (result.error) {
      throw new HttpException(result.error.message, result.error.statusCode, {
        cause: result.error,
      });
    }

    const [user, authCookie] = result.value;
    res.setHeader("set-cookie", authCookie);

    return user;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidator(LoginSchema)) input: LoginSchema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginService.run(input);
    if (result.error) {
      throw new HttpException(result.error.message, result.error.statusCode, {
        cause: result.error,
      });
    }

    const [user, authCookie] = result.value;
    res.setHeader("set-cookie", authCookie);

    return user;
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = await this.logoutService.run(req.headers);
    if (cookies.error) {
      throw cookies.error;
    }

    for (const cookie of cookies.value) {
      res.append("set-cookie", cookie);
    }

    return;
  }

  @Get("me")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    const result = await this.meService.run(req.headers);
    if (result.error) {
      throw result.error;
    }

    const [session, user] = result.value;
    return { session, user };
  }
}
