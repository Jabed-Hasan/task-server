import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/entities/User.entity';
import { Admin } from './src/entities/Admin.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [User, Admin],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
