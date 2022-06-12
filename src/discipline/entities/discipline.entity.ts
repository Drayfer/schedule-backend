import { LessonEntity } from './../../lesson/entities/lesson.entity';
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
  ManyToMany,
  JoinTable,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity('Discipline')
export class DisciplineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  color: string;

  // @Column()
  // students: number[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column()
  userId: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToMany(() => StudentEntity, (student) => student.disciplines)
  @JoinTable()
  students: StudentEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.discipline)
  lessons: LessonEntity[];
}
