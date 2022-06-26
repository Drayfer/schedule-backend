import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateOptionDto {
  rateWithBalance: number;

  @IsNumber()
  rateWithoutBalance: number;

  @IsBoolean()
  notification: boolean;

  @IsNumber()
  notifyMinutes: number;

  @IsNumber()
  notifyVolume: number;
}
