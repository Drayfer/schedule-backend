import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  studentId: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsNumber()
  disciplineId: number;
}
