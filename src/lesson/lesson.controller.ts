import { GetAllLessonsDto } from './dto/getAll-lesson.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('create')
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Post('all')
  findAll(@Body() dto: GetAllLessonsDto) {
    return this.lessonService.findAll(dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(Number(id));
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(Number(id), dto);
  }

  @Delete('deleteSome/:studentId')
  updateDelete(@Param('studentId') studentId: string) {
    return this.lessonService.updateDelete(Number(studentId));
  }
}
