import { OptionEntity } from './../option/entities/option.entity';
import { UserEntity } from './entities/user.entity';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.save(dto);
    await this.optionRepository.save({
      userId: user.id,
    });
    return user;
  }

  findAllUsers() {
    return { data: 'ok' };
  }

  findOneUser(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  activateUser(id: number) {
    this.userRepository.update({ id }, { activate: true });
  }

  async removeUser(id: number) {
    const user = await this.userRepository.delete({ id });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async setNewPassword(dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    const hashPassword = await bcrypt.hash(dto.password, 3);
    await this.userRepository.update(user.id, { password: hashPassword });
    return;
  }

  async updateProfile(dto: CreateUserDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const hashPassword = await bcrypt.hash(dto.password, 3);
    await this.userRepository.update(user.id, {
      password: hashPassword,
      name: dto.name,
      email: dto.email,
    });

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    return { name: updatedUser.name, email: updatedUser.email };
  }

  async updateGuide(userId: number) {
    await this.userRepository.update(
      { id: userId },
      {
        guide: true,
      },
    );
    return;
  }
}
