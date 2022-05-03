import { IsEmail } from 'class-validator';

export class ForgotUserPasswordDto {
  @IsEmail()
  email: string;
}
