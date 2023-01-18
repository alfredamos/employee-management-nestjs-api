import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender, UserType } from '@prisma/client';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;
  @IsString()
  @IsNotEmpty()
  dateOfBirth: Date;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword?: string;
  @IsString()
  @IsOptional()
  departmentId: string;
}
