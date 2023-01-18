import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('Admin', 'Management', 'Staff')
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Roles('Admin', 'Management', 'Staff')
  @Get('employee-departments/:departmentId')
  findAllEmployeesByDepartmentId(@Param('departmentId') departmentId: string) {
    return this.employeesService.findAllEmployeesByDepartmentId(departmentId);
  }

  @Roles('Admin', 'Management', 'Staff')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
