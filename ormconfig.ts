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
  synchronize: true, // Keep enabled for now (disable after stable)
  dropSchema: process.env.NODE_ENV === 'development', // Drop and recreate in development
  logging: process.env.NODE_ENV !== 'production',
  entities: process.env.NODE_ENV === 'production' 
    ? [User, Admin, Provider, Specialist, ServiceOffering, PlatformFee, Media]
    : [User, Admin, Provider, Specialist, ServiceOffering, PlatformFee, Media],
  migrations: process.env.NODE_ENV === 'production' 
    ? ['dist/src/migrations/**/*.js']
    : ['src/migrations/**/*.ts'],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
