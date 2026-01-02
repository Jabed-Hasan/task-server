import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('providers')
export class Provider {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  contactNumber!: string | null;

  @Column({ type: 'varchar', nullable: true })
  profilePhoto!: string | null;

  @Column({ type: 'varchar', nullable: true })
  companyName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  businessRegistrationNumber!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
