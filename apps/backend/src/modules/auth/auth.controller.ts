import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from "@nestjs/common";
import { CreateUserSchema } from "@repo/schemas/user";
import type { Response } from "express";
import { RegisterService } from "#/modules/auth/services/register.service";
import { ZodValidator } from "#/pipes/zod-validator.pipe";

@Controller("auth")
export class AuthController {
  @Inject(RegisterService) private readonly registerService: RegisterService;

  constructor(createUserService: RegisterService) {
    this.registerService = createUserService;
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

    return {
      success: true,
      data: user,
    };
  }
}
