import { LessonEntity } from './../lesson/entities/lesson.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { OptionEntity } from './entities/option.entity';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingEntity } from 'src/billing/entities/billing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OptionEntity,
      StudentEntity,
      LessonEntity,
      BillingEntity,
    ]),
    AuthModule,
  ],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
