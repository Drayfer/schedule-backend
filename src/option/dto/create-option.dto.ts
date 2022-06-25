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

export class CreateOptionDto {
  @IsNumber()
  userId: number;

  @IsBoolean()
  @IsOptional()
  notification?: boolean;
}
