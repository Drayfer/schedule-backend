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
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateDisciplineDto) {
    return this.disciplineService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplineDto: UpdateDisciplineDto,
  ) {
    return this.disciplineService.update(Number(id), updateDisciplineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.disciplineService.findAll(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplineService.remove(+id);
  }
}
