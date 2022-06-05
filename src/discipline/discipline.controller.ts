import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post('create')
  create(@Body() dto: CreateDisciplineDto) {
    return this.disciplineService.create(dto);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplineDto: UpdateDisciplineDto,
  ) {
    return this.disciplineService.update(Number(id), updateDisciplineDto);
  }

  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.disciplineService.findAll(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplineService.remove(+id);
  }

  // @Get()
  // findAll() {
  //   return this.disciplineService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.disciplineService.findOne(+id);
  // }
}
