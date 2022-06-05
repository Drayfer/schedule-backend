import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateDisciplineDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  color: string;

  @IsArray()
  studentId: number[];
}
