import { UserEntity } from './../user/entities/user.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from './entities/lesson.entity';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonEntity, StudentEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
