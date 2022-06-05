import { DisciplineEntity } from './../discipline/entities/discipline.entity';
import { UserModule } from './../user/user.module';
import { UserEntity } from './../user/entities/user.entity';
import { AuthModule } from './../auth/auth.module';
import { StudentEntity } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity, UserEntity, DisciplineEntity]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
