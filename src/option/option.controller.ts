import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  // @Post('create')
  // create(@Body() dto: CreateOptionDto) {
  //   return this.optionService.create(dto);
  // }

  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.optionService.findAll(Number(id));
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateOptionDto) {
    return this.optionService.update(Number(id), dto);
  }

  @Get('statistic/:userId')
  getSttistic(@Param('userId') userId: string) {
    return this.optionService.getSttistic(Number(userId));
  }

  @Get('statistic/chart/:userId')
  getChart(@Param('userId') userId: string) {
    return this.optionService.getChart(Number(userId));
  }
}
