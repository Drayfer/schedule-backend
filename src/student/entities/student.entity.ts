import { DisciplineEntity } from './../../discipline/entities/discipline.entity';
import { LessonEntity } from './../../lesson/entities/lesson.entity';
import { UserEntity } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity('Student')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: true })
  showBalance: boolean;

  @Column({ default: false })
  break: boolean;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  skype: string;

  @Column({ default: '' })
  note: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  parent: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column()
  userId: number;

  @Column({ default: false })
  delete: boolean;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
    select: false,
  })
  balanceHistory: Array<{
    date: Date;
    count: number;
  }>;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.student, {
    onDelete: 'CASCADE',
  })
  lessons: LessonEntity[];

  @ManyToMany(() => DisciplineEntity, (discipline) => discipline.students, {
    onDelete: 'CASCADE',
  })
  disciplines: DisciplineEntity[];
}
