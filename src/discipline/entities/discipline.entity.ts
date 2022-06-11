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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToMany(() => StudentEntity, (student) => student.disciplines)
  @JoinTable()
  students: StudentEntity[];
}
