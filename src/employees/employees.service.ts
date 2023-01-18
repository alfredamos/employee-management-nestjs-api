import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions';
import { EmployeeInfo } from './dto/employee-info.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<EmployeeInfo[]> {
    return await this.prisma.employee.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAllEmployeesByDepartmentId(
    departmentId: string,
  ): Promise<EmployeeInfo[]> {
    return await this.prisma.employee.findMany({
      where: { departmentId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<EmployeeInfo> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id = ${id} is not found`);
    }
    return employee;
  }

  async remove(id: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id = ${id} is not found`);
    }

    return await this.prisma.employee.delete({
      where: { id },
    });
  }
}
