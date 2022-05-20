import { LessonEntity } from './../../lesson/entities/lesson.entity';
import { StudentEntity } from './../../student/entities/student.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  activate: boolean;

  @Column({ default: 0 })
  lessonsHistory: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => StudentEntity, (student) => student.user)
  students: StudentEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.user)
  lessons: LessonEntity[];
}
