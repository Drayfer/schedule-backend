import { PartialType } from '@nestjs/mapped-types';
import { IsArray } from 'class-validator';
import { CreateDisciplineDto } from './create-discipline.dto';

export class UpdateDisciplineDto extends PartialType(CreateDisciplineDto) {
  // studentId: number[];
}
