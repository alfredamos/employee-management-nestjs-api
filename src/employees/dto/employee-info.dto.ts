import { Gender} from '@prisma/client';

export class EmployeeInfo{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    gender: Gender;
    department: Department | null;
}

class Department{
    name: string;
}