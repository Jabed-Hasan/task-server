import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Admin } from '../entities/Admin.entity';
import { Provider } from '../entities/Provider.entity';
import { Specialist } from '../entities/Specialist.entity';
import { ServiceOffering } from '../entities/ServiceOffering.entity';
import { PlatformFee } from '../entities/PlatformFee.entity';
import { Media } from '../entities/Media.entity';
import config from './index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database_url,
  synchronize: true, // Auto-sync enabled - ⚠️ Use only in development
  logging: false,
  entities: [User, Admin, Provider, Specialist, ServiceOffering, PlatformFee, Media],
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
