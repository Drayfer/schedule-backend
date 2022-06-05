import { DisciplineEntity } from './entities/discipline.entity';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './../user/entities/user.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisciplineEntity, StudentEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [DisciplineController],
  providers: [DisciplineService],
})
export class DisciplineModule {}
