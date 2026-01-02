import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Specialist } from './Specialist.entity';

@Entity('service_offerings')
export class ServiceOffering {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column('uuid', { name: 'specialists' })
  specialists!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Specialist, (specialist) => specialist.service_offerings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialists' })
  specialist!: Specialist;
}
