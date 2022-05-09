import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsBoolean()
  @IsOptional()
  showBalance: boolean;

  @IsBoolean()
  @IsOptional()
  break: boolean;
}
