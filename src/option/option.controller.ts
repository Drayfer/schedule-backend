import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.optionService.findAll(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateOptionDto) {
    return this.optionService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistic/:userId')
  getSttistic(@Param('userId') userId: string) {
    return this.optionService.getSttistic(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistic/chart/:userId/utc/:utcMinutes')
  getChart(
    @Param('userId') userId: string,
    @Param('utcMinutes') utcMinutes: string,
  ) {
    return this.optionService.getChart(Number(userId), Number(utcMinutes));
  }
}
