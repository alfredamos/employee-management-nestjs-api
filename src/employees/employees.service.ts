import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Roles } from 'src/decorators/roles.decorator';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService){}

  async findAll(): Promise<Employee[]> {
    return await this.prisma.employee.findMany({
      include: {
        department: true,
      }
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: {id},
      include: {
        department: true,
      }
    })

    if (!employee) {
      throw new NotFoundException(`Employee with id = ${id} is not found`);
    }
    return employee;
  }

  
  async remove(id: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: {id},
      
    })

    if (!employee) {
      throw new NotFoundException(`Employee with id = ${id} is not found`);
    }

    return await this.prisma.employee.delete({
      where: {id}, 
    });
  }
}
