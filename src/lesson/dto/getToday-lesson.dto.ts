import { IsDateString, IsNumber } from 'class-validator';

export class GetTodayLessonsDto {
  @IsNumber()
  userId: number;

  @IsDateString()
  date: Date;
}
