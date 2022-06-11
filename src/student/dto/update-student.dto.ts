import { DisciplineEntity } from './../../discipline/entities/discipline.entity';
import { CreateStudentDto } from './create-student.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsArray } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsBoolean()
  @IsOptional()
  showBalance: boolean;

  @IsBoolean()
  @IsOptional()
  break: boolean;

  @IsArray()
  @IsOptional()
  updateDisciplines: number[];

  @IsOptional()
  disciplines: DisciplineEntity[];
}
