import { StudentEntity } from './../student/entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisciplineEntity } from './entities/discipline.entity';
import { Injectable } from '@nestjs/common';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Injectable()
export class DisciplineService {
  constructor(
    @InjectRepository(DisciplineEntity)
    private disciplineRepository: Repository<DisciplineEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async create(dto: CreateDisciplineDto) {
    const students = await this.studentRepository.findByIds(dto.studentId);
    const discipline = await this.disciplineRepository.save({
      title: dto.title,
      color: dto.color,
      userId: dto.userId,
      students,
    });
    return discipline;
  }

  async update(id: number, dto: UpdateDisciplineDto) {
    const students = await this.studentRepository.findByIds(dto.studentId);
    const discipline = await this.disciplineRepository.findOneBy({
      id,
    });
    discipline.students = students;

    return this.disciplineRepository.save({ ...discipline, ...dto });
  }

  async findAll(id: number) {
    const disciplines = await this.disciplineRepository.find({
      relations: {
        students: true,
      },
      where: {
        userId: Number(id),
      },
      order: {
        createdDate: 'DESC',
      },
    });
    return disciplines;
  }

  async remove(id: number) {
    await this.disciplineRepository.delete({ id });
  }

  // findAll() {
  //   return `This action returns all discipline`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} discipline`;
  // }

  // update(id: number, updateDisciplineDto: UpdateDisciplineDto) {
  //   return `This action updates a #${id} discipline`;
  // }
}
