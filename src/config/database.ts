import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Admin } from '../entities/Admin.entity';
import config from './index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database_url,
  synchronize: false, // Set to false in production, use migrations instead
  logging: false,
  entities: [User, Admin],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});

// Initialize the data source
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error(' Error during Data Source initialization:', error);
    throw error;
  }
};

export default AppDataSource;
