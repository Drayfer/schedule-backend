import { OptionEntity } from './../../option/entities/option.entity';
import { DisciplineEntity } from './../../discipline/entities/discipline.entity';
import { LessonEntity } from './../../lesson/entities/lesson.entity';
import { StudentEntity } from './../../student/entities/student.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
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

  @OneToMany(() => DisciplineEntity, (discipline) => discipline.user)
  discipline: DisciplineEntity[];

  // @OneToOne(() => OptionEntity)
  // @JoinColumn({ name: 'optionId', referencedColumnName: 'id' })
  // option: OptionEntity;
}
