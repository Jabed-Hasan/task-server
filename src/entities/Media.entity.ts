import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Specialist } from './Specialist.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export enum MimeType {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  MP4 = 'video/mp4',
  PDF = 'application/pdf',
}

@Entity('media')
export class Media {
  @PrimaryColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column('uuid')
  @Generated('uuid')
  uuid!: string;

  @Column('uuid', { name: 'specialist_id' })
  specialist_id!: string;

  @Column({ type: 'varchar', length: 255 })
  file_name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cloudinary_public_id?: string;

  @Column({ type: 'int' })
  file_size!: number;

  @Column({ type: 'int', nullable: true })
  display_order!: number;

  @Column({
    type: 'enum',
    enum: MimeType,
  })
  mime_type!: MimeType;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  media_type!: MediaType;

  @Column({ type: 'timestamp' })
  uploaded_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @ManyToOne(() => Specialist, (specialist) => specialist.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialist_id' })
  specialist!: Specialist;
}
