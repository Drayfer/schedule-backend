import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Billing')
export class BillingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  diakaArr: Array<{
    name: string;
    amount: string;
    currency: string;
  }>;
}
