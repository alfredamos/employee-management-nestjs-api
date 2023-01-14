import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from './sign-up-auth.dto';
import { IsUUID } from 'class-validator';

export class UpdateAuthDto extends PartialType(SignupDto) {
  @IsUUID()
  id: string;
}
