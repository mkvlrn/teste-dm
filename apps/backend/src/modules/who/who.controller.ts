import { CacheInterceptor } from "@nestjs/cache-manager";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { WhoQuerySchema } from "@repo/schemas/who";
import { SearchService } from "#/modules/who/services/search.service";
import { AuthGuard } from "#/shared/guards/auth.guard";
import { ZodValidator } from "#/shared/pipes/zod-validator.pipe";

@Controller("who")
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class WhoController {
  @Inject(SearchService) private readonly service: SearchService;

  constructor(service: SearchService) {
    this.service = service;
  }

  @Get("code/:code")
  @HttpCode(HttpStatus.OK)
  async byCode(@Param("code") code: string) {
    const result = await this.service.byCode(code);
    if (result.error) {
      throw result.error;
    }

    return result;
  }

  @Get("search")
  @HttpCode(HttpStatus.OK)
  async bySearch(@Query(new ZodValidator(WhoQuerySchema)) query: WhoQuerySchema) {
    const result = await this.service.bySearch(query);
    if (result.error) {
      throw result.error;
    }

    return result;
  }
}
