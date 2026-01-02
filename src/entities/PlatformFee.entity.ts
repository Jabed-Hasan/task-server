import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('platform_fee')
export class PlatformFee {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column('uuid')
  @Generated('uuid')
  uuid!: string;

  @Column({ type: 'varchar', length: 255 })
  tier_name!: string;

  @Column({ type: 'int' })
  min_value!: number;

  @Column({ type: 'int' })
  max_value!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  platform_fee_percentage!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  deleted_at!: boolean;
}
