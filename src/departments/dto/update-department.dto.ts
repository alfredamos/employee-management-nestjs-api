import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsString, IsNotEmpty } from 'class-validator';


export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
    @IsString()
    @IsNotEmpty()
    id: string;
}
