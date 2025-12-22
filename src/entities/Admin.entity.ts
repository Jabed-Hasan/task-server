import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Generated } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  profilePhoto?: string;

  @Column()
  contactNumber!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn({ name: 'updatedAt' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => require('./User.entity').User, (user: any) => user.admin)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user!: any;
}
