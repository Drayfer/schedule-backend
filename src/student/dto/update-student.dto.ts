import { CreateStudentDto } from './create-student.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsBoolean()
  @IsOptional()
  showBalance: boolean;

  @IsBoolean()
  @IsOptional()
  break: boolean;
}
