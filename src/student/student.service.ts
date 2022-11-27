import { LessonEntity } from './../lesson/entities/lesson.entity';
import { DisciplineEntity } from './../discipline/entities/discipline.entity';
import { UserEntity } from './../user/entities/user.entity';
import { StudentEntity } from './entities/student.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Repository } from 'typeorm';
import * as rc from 'randomcolor';
import * as moment from 'moment';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DisciplineEntity)
    private disciplineRepository: Repository<DisciplineEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  async create(dto: CreateStudentDto) {
    const { id } = await this.studentRepository.save({ ...dto, color: rc() });
    const student = await this.studentRepository.findOne({
      where: { id, delete: false },
      relations: { disciplines: true },
    });
    return student;
  }

  async findAll(id: string) {
    const students = await this.studentRepository.find({
      where: {
        userId: Number(id),
        delete: false,
      },
      order: {
        createdDate: 'DESC',
        disciplines: {
          title: 'ASC',
        },
      },
      relations: {
        disciplines: true,
      },
    });

    return students;
  }

  async remove(id: number) {
    // await this.studentRepository.delete({ id });
    const { id: studentId } = await this.studentRepository.findOneBy({ id });
    const lessons = await this.lessonRepository.find({
      where: {
        studentId,
      },
    });
    if (!lessons.some((lesson) => lesson.complete)) {
      this.studentRepository.delete({ id });
      return;
    }
    await this.studentRepository.update(
      {
        id: studentId,
      },
      {
        delete: true,
        updatedDate: new Date(),
      },
    );
  }

  async update(id: number, dto: UpdateStudentDto) {
    const { balance, balanceHistory } = await this.studentRepository.findOne({
      where: { id },
      select: ['balanceHistory', 'balance'],
    });
    delete dto.disciplines;
    delete dto.updateDisciplines;
    const updatedBalanceHistory =
      dto.balance !== 0 && dto.updateBalanceHistory
        ? [
            {
              date: new Date(),
              count: Number(dto.balance),
            },
            ...balanceHistory,
          ]
        : balanceHistory;
    delete dto.updateBalanceHistory;
    await this.studentRepository.update(
      {
        id,
      },
      {
        ...dto,
        balance: dto.balance ? Number(dto.balance) + balance : balance,
        updatedDate: new Date(),
        balanceHistory: updatedBalanceHistory,
      },
    );
    return this.studentRepository.findOne({
      where: { id },
      relations: {
        disciplines: true,
      },
    });
  }

  async getBalanceHistory(id: number) {
    const lessons = await this.lessonRepository.find({
      where: {
        studentId: id,
        complete: true,
      },
      order: {
        date: 'DESC',
      },
    });
    const { balanceHistory } = await this.studentRepository.findOne({
      where: { id },
      select: ['balanceHistory'],
    });
    const redactBalanceHistory = balanceHistory.map((item) => ({
      date: item.date,
      action: item.count > 0 ? 'add' : 'subtract',
      count: item.count,
    }));
    const history = lessons.map((item) => ({
      date: item.date,
      action: 'lesson',
      count: -1,
    }));
    return [...history, ...redactBalanceHistory].sort((a, b) =>
      moment(a.date).isBefore(b.date) ? 1 : -1,
    );
  }
}
