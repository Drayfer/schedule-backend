import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  length,
  Length,
  Min,
} from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsBoolean()
  showBalance: boolean;
}
