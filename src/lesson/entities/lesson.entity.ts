import { StudentEntity } from './../../student/entities/student.entity';
import { UserEntity } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Lesson')
export class LessonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  userId: number;

  @Column()
  studentId: number;

  @Column({ default: false })
  complete: boolean;

  @Column({ default: 'general' })
  category: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'studentId', referencedColumnName: 'id' })
  student: StudentEntity;
}
