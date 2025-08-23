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
import { CreateEmployeeSchema, UpdateEmployeeSchema } from "@repo/schemas/employee";
import { EmployeeQuerySchema } from "@repo/schemas/query";
import { CreateEmployeeService } from "#/modules/employee/services/create-employee.service";
import { DeleteEmployeeService } from "#/modules/employee/services/delete-employee.service";
import { GetEmployeeService } from "#/modules/employee/services/get-employee.service";
import { ListEmployeesService } from "#/modules/employee/services/list-employees.service";
import { UpdateEmployeeService } from "#/modules/employee/services/update-employee.service";
import { AuthGuard } from "#/shared/guards/auth.guard";
import { ZodValidator } from "#/shared/pipes/zod-validator.pipe";

@Controller("employees")
@UseGuards(AuthGuard)
export class EmployeeController {
  @Inject(CreateEmployeeService) private readonly createService: CreateEmployeeService;
  @Inject(GetEmployeeService) private readonly getService: GetEmployeeService;
  @Inject(ListEmployeesService) private readonly listService: ListEmployeesService;
  @Inject(UpdateEmployeeService) private readonly updateService: UpdateEmployeeService;
  @Inject(DeleteEmployeeService) private readonly deleteService: DeleteEmployeeService;

  constructor(
    createService: CreateEmployeeService,
    getService: GetEmployeeService,
    listService: ListEmployeesService,
    updateService: UpdateEmployeeService,
    deleteService: DeleteEmployeeService,
  ) {
    this.createService = createService;
    this.getService = getService;
    this.listService = listService;
    this.updateService = updateService;
    this.deleteService = deleteService;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidator(CreateEmployeeSchema)) input: CreateEmployeeSchema) {
    const result = await this.createService.run(input);
    if (result.error) {
      throw result.error;
    }

    return result.value;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query(new ZodValidator(EmployeeQuerySchema)) query: EmployeeQuerySchema) {
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
    @Body(new ZodValidator(UpdateEmployeeSchema)) input: UpdateEmployeeSchema,
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
