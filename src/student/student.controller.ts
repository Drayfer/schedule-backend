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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.studentService.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balanceHistory/:id')
  getBalanceHistory(@Param('id') id: string) {
    return this.studentService.getBalanceHistory(Number(id));
  }
}
