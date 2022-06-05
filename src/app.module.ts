import { DisciplineEntity } from './discipline/entities/discipline.entity';
import { LessonEntity } from './lesson/entities/lesson.entity';
import { StudentEntity } from './student/entities/student.entity';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { LessonModule } from './lesson/lesson.module';
import { DisciplineModule } from './discipline/discipline.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, StudentEntity, LessonEntity, DisciplineEntity],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    ConfigModule.forRoot({ expandVariables: true }),
    AuthModule,
    StudentModule,
    LessonModule,
    DisciplineModule,
  ],
})
export class AppModule {}
