import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
