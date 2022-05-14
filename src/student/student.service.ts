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
  ) {}

  async create(dto: CreateStudentDto) {
    const student = await this.studentRepository.save({ ...dto, color: rc() });
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
      },
    });
    return students;
  }

  async remove(id: number) {
    // await this.studentRepository.delete({ id });
    const { id: studentId } = await this.studentRepository.findOneBy({ id });
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
    let currentBalance: { balance: number } | {} = {};

    if (dto.balance) {
      currentBalance = {
        balance: Number(dto.balance) + balance,
      };
    }

    await this.studentRepository.update(
      {
        id: studentId,
      },
      {
        ...dto,
        ...currentBalance,
        updatedDate: new Date(),
      },
    );
    return this.studentRepository.findOneBy({ id });
  }
}
