import { Repository } from 'typeorm';
import { OptionEntity } from './entities/option.entity';
import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}

  // create(dto: CreateOptionDto) {
  //   return this.optionRepository.save(dto);
  // }

  async findAll(id: number) {
    const options = await this.optionRepository.findOne({
      where: {
        userId: id,
      },
    });
    return options;
  }

  // findAll() {
  //   return `This action returns all option`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} option`;
  // }

  // update(id: number, updateOptionDto: UpdateOptionDto) {
  //   return `This action updates a #${id} option`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} option`;
  // }
}
