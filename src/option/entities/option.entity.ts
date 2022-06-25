import { UserEntity } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('Option')
export class OptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  rateWithBalance: number;

  @Column({ default: 0 })
  rateWithoutBalance: number;

  @Column({ default: true })
  notification: boolean;

  @Column({ default: 3 })
  notifyMinutes: number;

  @Column({ default: 100 })
  notifyVolume: number;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
