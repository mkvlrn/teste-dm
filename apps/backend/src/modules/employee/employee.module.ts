import { Module } from "@nestjs/common";
import { EmployeeController } from "#/modules/employee/employee.controller";
import { CreateEmployeeService } from "#/modules/employee/services/create-employee.service";
import { DeleteEmployeeService } from "#/modules/employee/services/delete-employee.service";
import { GetEmployeeService } from "#/modules/employee/services/get-employee.service";
import { ListEmployeesService } from "#/modules/employee/services/list-employees.service";
import { UpdateEmployeeService } from "#/modules/employee/services/update-employee.service";

@Module({
  imports: [],
  exports: [],
  providers: [
    CreateEmployeeService,
    GetEmployeeService,
    ListEmployeesService,
    UpdateEmployeeService,
    DeleteEmployeeService,
  ],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
