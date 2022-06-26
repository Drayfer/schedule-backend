import { LessonEntity } from './../lesson/entities/lesson.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { OptionEntity } from './entities/option.entity';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OptionEntity,
      StudentEntity,
      LessonEntity,
    ]),
    AuthModule,
  ],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
