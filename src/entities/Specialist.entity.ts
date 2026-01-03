import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { ServiceOffering } from './ServiceOffering.entity';
import { Media } from './Media.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('specialists')
export class Specialist {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column('uuid')
  @Generated('uuid')
  uuid!: string;

  @Column({ type: 'uuid', nullable: true })
  provider_id?: string;

  @Column({ type: 'uuid', nullable: true })
  created_by_id?: string;

  @Column({ type: 'varchar', nullable: true })
  created_by_name?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating!: number;

  @Column({ default: true })
  is_draft!: boolean;

  @Column({ type: 'int', default: 0 })
  total_number_of_ratings!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  platform_fee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_price!: number;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verification_status!: VerificationStatus;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ type: 'int', nullable: true })
  duration_days!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  service_category?: string;

  @Column({ type: 'json', nullable: true })
  supported_company_types?: string[];

  @Column({ type: 'json', nullable: true })
  additional_offerings?: string[];

  @Column({ type: 'json', nullable: true })
  service_offerings_data?: string[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date;

  // Relations
  @OneToMany(() => ServiceOffering, (serviceOffering) => serviceOffering.specialist, {
    cascade: true,
  })
  service_offerings!: ServiceOffering[];

  @OneToMany(() => Media, (media) => media.specialist, {
    cascade: true,
  })
  media!: Media[];
}
