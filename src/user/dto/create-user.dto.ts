import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @Length(5)
  password: string;

  @IsEmail()
  email: string;
}

export class One {
  password: string;
}
