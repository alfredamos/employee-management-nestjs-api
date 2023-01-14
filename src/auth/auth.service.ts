import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/sign-up-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmployeeResponse } from './dto/employee-response.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<EmployeeResponse> {
    const { email, oldPassword, newPassword, confirmPassword } =
      changePasswordDto;

    //----> Check if newPassword and confirmPassword are equal.
    if (newPassword.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException("Your passwords don't match.");
    }

    //----> Check for the existence of employee
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      throw new ForbiddenException('Your credentials are not valid');
    }

    //----> Check the if the old password is authentic.
    const oldHashedPassword = employee.password;
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword);

    //----> Is the provided old password the same as the one in the database?.
    if (!isValid) {
      throw new ForbiddenException('Your credentials are not valid');
    }

    //----> Hash the new password.
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedCredential = await this.prisma.employee.update({
      where: { email },
      data: { ...employee, password: newHashedPassword },
    });

    return {
      id: updatedCredential.id,
      fullName: updatedCredential.fullName,
      userType: updatedCredential.userType,
      message: 'Password updated successfully',
    };
  }

  async changeProfile(
    changeProfileDto: ChangeProfileDto,
  ): Promise<EmployeeResponse> {
    const { email, password, newPassword } = changeProfileDto;

    //----> Check for the existence of user.
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    //----> Is employee credential genuine?
    if (!employee) {
      throw new ForbiddenException('Invalid credentials');
    }

    //----> Get the password in the database.
    const oldHashedPassword = employee.password;

    //----> Check for the authenticity of password?
    const isValid = await bcrypt.compare(password, oldHashedPassword);

    if (!isValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const newHashedPassword = await bcrypt.hash(newPassword!, 12);
    changeProfileDto.password = newHashedPassword;
    delete changeProfileDto.newPassword;

    //----> Check the type of date of birth.
    const dateOfBirth = changeProfileDto.dateOfBirth;

    if (typeof dateOfBirth === "string"){
        changeProfileDto.dateOfBirth = new Date(dateOfBirth)
    }

    const updatedEmployeeProfile = await this.prisma.employee.update({
      where: { email },
      data: { ...changeProfileDto, id: employee.id },
    });

    return {
      id: updatedEmployeeProfile.id,
      fullName: updatedEmployeeProfile.fullName,
      userType: updatedEmployeeProfile.userType,
      message: 'Profile updated successfully',
    };
  }

  async login(loginDto: LoginDto): Promise<EmployeeResponse> {
    const { email, password } = loginDto;

    //----> Check for the existence of the email.
    const employee = await this.prisma.employee.findUnique({
      where: { email: email },
    });

    if (!employee) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //----> Check the password.
    const passwordInDatabase = employee.password;
    const isValid = await bcrypt.compare(password, passwordInDatabase);

    if (!isValid) {
      throw new ForbiddenException('Invalid credentials.');
    }

    //---> Jwt payload;
    const payload: EmployeeResponse = {
      id: employee.id,
      fullName: employee.fullName,
      userType: employee.userType,
    };

    //----> Get a jwt token.
    const token = await this.jwt.sign(payload);

    return {
      ...payload,
      message: 'You are successfully logged in',
      token,
    };
  }

  async signUp(signupDto: SignupDto): Promise<EmployeeResponse> {
    const { email, password, confirmPassword } = signupDto;

    //----> Check email.
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });

    //----> Check for the existence of employee.
    if (employee) {
      throw new ForbiddenException(
        'Email already exists, please another email.',
      );
    }

    //----> Check for if password matches the confirm password.
    if (password.normalize() !== confirmPassword?.normalize()) {
      throw new BadRequestException(
        'Password does not match confirm password.',
      );
    }

    delete signupDto.confirmPassword;

    //----> Hash password.
    const hashPassword = await bcrypt.hash(password, 12);

    //----> Check the type of date of birth.
    const dateOfBirth = signupDto.dateOfBirth;

    if (typeof dateOfBirth === 'string') {
      signupDto.dateOfBirth = new Date(dateOfBirth);
    }

    //----> Store the employee in the database.
    const newEmployee = await this.prisma.employee.create({
      data: { ...signupDto, password: hashPassword },
    });

    return {
      id: newEmployee.id,
      fullName: newEmployee.fullName,
      userType: newEmployee.userType,
      message: 'signup is successful.',
    };
  }
}
