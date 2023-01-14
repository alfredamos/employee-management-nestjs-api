import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender, UserType } from '@prisma/client';


export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
  @IsString()
  @IsNotEmpty()
  dateOfBirth: Date;
  @IsString()
  @IsOptional()
  departmentId: string;
}
