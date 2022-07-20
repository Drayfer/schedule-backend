import { UserEntity } from './../user/entities/user.entity';
import { GetTodayLessonsDto } from './dto/getToday-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { StudentEntity } from './../student/entities/student.entity';
import { GetAllLessonsDto } from './dto/getAll-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LessonEntity } from './entities/lesson.entity';
import {
  Injectable,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    const { studentId, userId } = await this.lessonRepository.findOneBy({ id });
    await this.lessonRepository.update(
      {
        id,
      },
      {
        ...dto,
      },
    );
    if (dto.complete === false || dto.complete === true) {
      const { lessonsHistory } = await this.userRepository.findOneBy({
        id: userId,
      });
      await this.userRepository.update(
        { id: userId },
        {
          lessonsHistory: dto.complete
            ? lessonsHistory + 1
            : lessonsHistory - 1,
        },
      );
    }

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

  async copyLessonsWeek(userId: number, dateStart: Date) {
    const dateEnd = moment(dateStart).add(6, 'days').toDate();
    const dateStart2 = moment(dateStart).add(1, 'week').toDate();
    const dateEnd2 = moment(dateStart2).add(6, 'days').toDate();

    const prevWeekStudents = await this.studentRepository.find({
      where: {
        userId,
        delete: false,
        break: false,
      },
    });

    const lessons = await (
      await this.findAll({ userId, dateStart, dateEnd })
    ).filter((les) => {
      return prevWeekStudents.find((student) => student.id === les.studentId);
    });

    if (!lessons.length)
      throw new HttpException(
        'The previous week is empty.',
        HttpStatus.BAD_REQUEST,
      );
    const lessons2 = await this.findAll({
      userId,
      dateStart: dateStart2,
      dateEnd: dateEnd2,
    }).then((items) =>
      items.filter((item) =>
        lessons.find(
          (lesson) =>
            moment(lesson.date).toString() ===
            moment(item.date).subtract(1, 'weeks').toString(),
        ),
      ),
    );

    const notCopy =
      lessons.length &&
      lessons.some((les, i) => les?.studentId !== lessons2[i]?.studentId);

    if (notCopy) {
      const newLessonsWeek = lessons.map((lesson) => {
        const obj = {
          ...lesson,
          date: moment(lesson.date).add(1, 'weeks').toDate(),
          complete: false,
        };
        delete obj.id;
        return obj;
      });

      await this.lessonRepository.save(newLessonsWeek);

      return this.findAll({
        userId,
        dateStart: dateStart2,
        dateEnd: dateEnd2,
      });
    }

    throw new HttpException(
      'The schedule has already been copied',
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteLessonsWeek(userId: number, dateStart: Date) {
    const dateEnd = moment(dateStart).add(6, 'days').toDate();

    await this.lessonRepository.delete({
      userId,
      date: Between(
        // moment(dateStart).startOf('day').toDate(),
        // moment(dateEnd).endOf('day').toDate(),
        new Date(moment(dateStart).startOf('day').toDate().toUTCString()),
        new Date(moment(dateEnd).endOf('day').toDate().toUTCString()),
      ),
      complete: false,
    });

    return this.findAll({
      userId,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });
  }

  async deleteLessonsDay(userId: number, dateStart: Date, date: Date) {
    await this.lessonRepository.delete({
      userId,
      date: Between(
        moment(date).startOf('day').toDate(),
        moment(date).endOf('day').toDate(),
      ),
      complete: false,
    });

    const dateEnd = moment(dateStart).add(6, 'days').toDate();

    return this.findAll({
      userId,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });
  }
}
