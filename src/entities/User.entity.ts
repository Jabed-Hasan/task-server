import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, Generated } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  SPECIALIST = 'SPECIALIST',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED'
}

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role!: UserRole;

  @Column({ default: true })
  needsPasswordReset!: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status!: UserStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn({ name: 'updatedAt' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => require('./Admin.entity').Admin, (admin: any) => admin.user)
  admin?: any;
}
