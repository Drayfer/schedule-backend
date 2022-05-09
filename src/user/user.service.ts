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
  ) {}

  async createUser(dto: CreateUserDto) {
    return this.userRepository.save(dto);
  }

  findAllUsers() {
    // return this.userRepository.find({ relations: { student: true } });
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
}
