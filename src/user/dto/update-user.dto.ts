import { IsString, Length, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdatePasswordDto {
  @IsString()
  @Length(5)
  password: string;

  @IsEmail()
  email: string;
}
