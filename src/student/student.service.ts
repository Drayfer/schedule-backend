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
    const { id: studentId, balance } = await this.studentRepository.findOneBy({
      id,
    });
    delete dto.disciplines;
    delete dto.updateDisciplines;
    await this.studentRepository.update(
      {
        id: studentId,
      },
      {
        ...dto,
        balance: dto.balance ? Number(dto.balance) + balance : balance,
        updatedDate: new Date(),
      },
    );
    return this.studentRepository.findOne({
      where: { id },
      relations: {
        disciplines: true,
      },
    });
  }
}
