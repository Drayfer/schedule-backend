import { IsBoolean, IsNumber } from 'class-validator';

export class SetStateLessonDto {
  @IsNumber()
  balanceCount: number;

  @IsBoolean()
  complete: boolean;
}
