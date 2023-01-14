import { UserType } from '@prisma/client';

export class EmployeeResponse{
    id!: string;
    fullName!: string;
    userType!: UserType;
    token?: string;
    message?: string;
}