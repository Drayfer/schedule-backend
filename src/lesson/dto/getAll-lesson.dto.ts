import { IsDateString, IsNumber } from 'class-validator';

export class GetAllLessonsDto {
  @IsNumber()
  userId: number;

  @IsDateString()
  dateStart: Date;

  @IsDateString()
  dateEnd: Date;
}
