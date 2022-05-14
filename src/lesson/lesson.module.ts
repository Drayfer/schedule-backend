import { StudentEntity } from './../student/entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from './entities/lesson.entity';
import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonEntity, StudentEntity]),
    AuthModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
