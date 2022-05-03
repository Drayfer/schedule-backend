import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotUserPasswordDto } from './../user/dto/forgot-user-password.dto';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { LoginUserDto } from './../user/dto/login-user.dto';
import {
  Body,
  Controller,
  Post,
  HttpCode,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    console.log(11111);
    return this.authService.login(dto);
  }

  @Post('/registration')
  @HttpCode(200)
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @Get('/activate/:token')
  activate(@Param('token') token: string) {
    return this.authService.activate(token);
  }

  @Post('/forgotPassword')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotUserPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/checkJwt/:token')
  // checkJwt(@Param('token') token: string) {
  //   return this.authService.checkJwt(token);
  // }
  @UseGuards(JwtAuthGuard)
  @Get('/checkJwt/')
  checkJwt(@Req() request: Request) {
    return this.authService.checkJwt(request.headers.authorization);
  }
}
