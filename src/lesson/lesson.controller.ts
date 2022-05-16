import { GetTodayLessonsDto } from './dto/getToday-lesson.dto';
import { GetAllLessonsDto } from './dto/getAll-lesson.dto';
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  findAll(@Body() dto: GetAllLessonsDto) {
    return this.lessonService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteSome/:studentId')
  updateDelete(@Param('studentId') studentId: string) {
    return this.lessonService.updateDelete(Number(studentId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('today')
  getToday(@Body() dto: GetTodayLessonsDto) {
    return this.lessonService.getToday(dto);
  }
}
