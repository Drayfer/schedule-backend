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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  // @OneToMany(() => StudentEntity, (student) => student.user)
  // student: StudentEntity[];

  @OneToMany(() => StudentEntity, (student) => student.user)
  students: StudentEntity[];
}
