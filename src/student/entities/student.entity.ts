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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ nullable: true })
  color: string;

  @Column()
  userId: number;

  @Column({ default: false })
  delete: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.student)
  lessons: LessonEntity[];
}
