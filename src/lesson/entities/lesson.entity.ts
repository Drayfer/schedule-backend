import { DisciplineEntity } from './../../discipline/entities/discipline.entity';
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

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  userId: number;

  @Column()
  studentId: number;

  @Column({ default: false })
  complete: boolean;

  @Column({ nullable: true })
  disciplineId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => StudentEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId', referencedColumnName: 'id' })
  student: StudentEntity;

  @ManyToOne(() => DisciplineEntity)
  @JoinColumn({ name: 'disciplineId', referencedColumnName: 'id' })
  discipline: DisciplineEntity;
}
