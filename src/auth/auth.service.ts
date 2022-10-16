import { IsEmail } from 'class-validator';
import { ForgotUserPasswordDto } from './../user/dto/forgot-user-password.dto';
import { UserEntity } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { LoginUserDto } from './../user/dto/login-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    const { token } = await this.generateToken(user);
    delete user.password;
    return {
      // name: user.name,
      // email: user.email,
      // id: user.id,
      token,
      // activate: user.activate,
      ...user,
      expToken: moment()
        .add(Number(process.env.TOKEN_EXP || 60), 'days')
        .unix(),
    };
  }

  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(dto.password, 3);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });
    const { token } = await this.generateToken(user);

    return {
      name: user.name,
      email: user.email,
      id: user.id,
      token,
    };
  }

  private async generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException({
        message: 'Invalid email or password',
      });
    const isPasswordsMatch = await bcrypt.compare(dto.password, user.password);
    if (user && isPasswordsMatch) return user;
    throw new UnauthorizedException({
      message: 'Invalid email or password',
    });
  }

  async activate(token: string) {
    const { id } = this.jwtService.decode(token) as { [key: string]: number };
    const user = await this.userService.findOneUser(id);
    if (user.activate) return { activate: false };
    await this.userService.activateUser(id);
    return { activate: true };
  }

  async forgotPassword({ email }: ForgotUserPasswordDto) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'This user was not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { token } = await this.generateToken(user);
    return { token, name: user.name };
  }

  async checkJwt(bearer: string) {
    const token = bearer.split(' ')[1];
    const { id } = this.jwtService.decode(token) as { [key: string]: number };
    const user = await this.userService.findOneUser(id);
    if (!user) {
      throw new HttpException(
        'This user was not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { email: user.email };
  }
}
