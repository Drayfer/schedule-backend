import { GetTodayLessonsDto } from './dto/getToday-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { StudentEntity } from './../student/entities/student.entity';
import { GetAllLessonsDto } from './dto/getAll-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { LessonEntity } from './entities/lesson.entity';
import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async create(dto: CreateLessonDto) {
    const lesson = await this.lessonRepository.save(dto);
    const student = await this.studentRepository.findOne({
      where: {
        id: lesson.studentId,
      },
    });
    const fullName = `${student.name}${
      student.surname ? ' ' + student.surname.slice(0, 1) + '.' : ''
    }`;
    return { ...lesson, fullName };
  }

  async findAll(dto: GetAllLessonsDto) {
    const lessons = await this.lessonRepository
      .find({
        relations: {
          student: true,
        },
        where: {
          userId: dto.userId,
          date: Between(
            moment(dto.dateStart).startOf('day').toDate(),
            moment(dto.dateEnd).endOf('day').toDate(),
          ),
        },
        order: {
          date: 'ASC',
        },
      })
      .then((lessons) =>
        lessons.map((lesson) => {
          const obj = {
            ...lesson,
            fullName: `${lesson.student.name}${
              lesson.student.surname
                ? ' ' + lesson.student.surname.slice(0, 1) + '.'
                : ''
            }`,
          };
          delete obj.student;
          return obj;
        }),
      );
    return lessons;
  }

  async remove(id: number) {
    await this.lessonRepository.delete({ id });
  }

  async update(id: number, dto: UpdateLessonDto) {
    const { studentId } = await this.lessonRepository.findOneBy({ id });
    await this.lessonRepository.update(
      {
        id,
      },
      {
        ...dto,
      },
    );
    const { name, surname } = await this.studentRepository.findOneBy({
      id: studentId,
    });

    const newLesson = await this.lessonRepository.findOneBy({ id });

    return {
      ...newLesson,
      fullName: `${name}${surname ? ' ' + surname.slice(0, 1) + '.' : ''}`,
    };
  }

  async updateDelete(studentId: number) {
    await this.lessonRepository.delete({ studentId, complete: false });
  }

  async getToday(dto: GetTodayLessonsDto) {
    const lessons = await this.lessonRepository
      .find({
        relations: {
          student: true,
        },
        where: {
          userId: dto.userId,
          date: Between(
            moment(dto.date).startOf('day').toDate(),
            moment(dto.date).endOf('day').toDate(),
          ),
        },
        order: {
          date: 'ASC',
        },
      })
      .then((data) => {
        return data.map((student) => {
          const lesson = {
            ...student,
            fullName:
              `${student.student.name} ${student.student.surname}`.trim(),
          };
          delete lesson.student;
          return lesson;
        });
      });
    return lessons;
  }
}
