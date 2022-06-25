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

  // @Get()
  // findAll() {
  //   return this.optionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.optionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
  //   return this.optionService.update(+id, updateOptionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.optionService.remove(+id);
  // }
}
