import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateCertificateSchema, UpdateCertificateSchema } from "@repo/schemas/certificate";
import { CertificateQuerySchema } from "@repo/schemas/query";
import { CreateCertificateService } from "#/modules/certificate/services/create-certificate.service";
import { DeleteCertificateService } from "#/modules/certificate/services/delete-certificate.service";
import { GetCertificateService } from "#/modules/certificate/services/get-certificate.service";
import { ListCertificatesService } from "#/modules/certificate/services/list-certificates.service";
import { UpdateCertificateService } from "#/modules/certificate/services/update-certificate.service";
import { AuthGuard } from "#/shared/guards/auth.guard";
import { ZodValidator } from "#/shared/pipes/zod-validator.pipe";

@Controller("certificates")
@UseGuards(AuthGuard)
export class CertificateController {
  @Inject(CreateCertificateService) private readonly createService: CreateCertificateService;
  @Inject(GetCertificateService) private readonly getService: GetCertificateService;
  @Inject(ListCertificatesService) private readonly listService: ListCertificatesService;
  @Inject(UpdateCertificateService) private readonly updateService: UpdateCertificateService;
  @Inject(DeleteCertificateService) private readonly deleteService: DeleteCertificateService;

  constructor(
    createService: CreateCertificateService,
    getService: GetCertificateService,
    listService: ListCertificatesService,
    updateService: UpdateCertificateService,
    deleteService: DeleteCertificateService,
  ) {
    this.createService = createService;
    this.getService = getService;
    this.listService = listService;
    this.updateService = updateService;
    this.deleteService = deleteService;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidator(CreateCertificateSchema)) input: CreateCertificateSchema) {
    const result = await this.createService.run(input);
    if (result.error) {
      throw result.error;
    }

    return result.value;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query(new ZodValidator(CertificateQuerySchema)) query: CertificateQuerySchema) {
    const result = await this.listService.run(query);
    if (result.error) {
      throw result.error;
    }

    return result.value;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async get(@Param("id") id: string) {
    const result = await this.getService.run(id);
    if (result.error) {
      throw result.error;
    }

    return result.value;
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body(new ZodValidator(UpdateCertificateSchema)) input: UpdateCertificateSchema,
  ) {
    const result = await this.updateService.run(id, input);
    if (result.error) {
      throw result.error;
    }

    return result.value;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    const result = await this.deleteService.run(id);
    if (result.error) {
      throw result.error;
    }

    return;
  }
}
