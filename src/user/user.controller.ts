import { UpdatePasswordDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOneUser(@Param('id') id: number) {
    return this.userService.findOneUser(+id);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

  @Put('/setNewPassword')
  setNewPassword(@Body() dto: UpdatePasswordDto) {
    return this.userService.setNewPassword(dto);
  }

  @Put('/updateProfile/:userId')
  updateProfile(@Body() dto: CreateUserDto, @Param('userId') userId: string) {
    return this.userService.updateProfile(dto, Number(userId));
  }
}
