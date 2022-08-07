import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  id: number;

  @IsString()
  text: string;

  @IsBoolean()
  complete: boolean;

  date: moment.Moment;
}
