import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/entities/User.entity';
import { Admin } from './src/entities/Admin.entity';
import { Provider } from './src/entities/Provider.entity';
import { Specialist } from './src/entities/Specialist.entity';
import { ServiceOffering } from './src/entities/ServiceOffering.entity';
import { PlatformFee } from './src/entities/PlatformFee.entity';
import { Media } from './src/entities/Media.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Auto-sync enabled - ⚠️ Use only in development
  logging: true,
  entities: [User, Admin, Provider, Specialist, ServiceOffering, PlatformFee, Media],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
