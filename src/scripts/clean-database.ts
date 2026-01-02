import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function cleanDatabase() {
  const tempDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false, // Don't auto-sync in cleanup script
  });

  try {
    console.log('🧹 Starting database cleanup...');
    
    await tempDataSource.initialize();
    console.log('✅ Database connection established');

    // Drop tables with null constraint issues
    console.log('Dropping users and admins tables...');
    await tempDataSource.query('DROP TABLE IF EXISTS "users" CASCADE');
    await tempDataSource.query('DROP TABLE IF EXISTS "admins" CASCADE');
    
    // Drop custom types if they exist
    await tempDataSource.query('DROP TYPE IF EXISTS "UserRole" CASCADE');
    await tempDataSource.query('DROP TYPE IF EXISTS "UserStatus" CASCADE');
    await tempDataSource.query('DROP TYPE IF EXISTS "users_role_enum" CASCADE');
    await tempDataSource.query('DROP TYPE IF EXISTS "users_status_enum" CASCADE');
    
    console.log('✅ Tables dropped successfully');
    console.log('💡 Auto-sync will recreate them on next server start');

    await tempDataSource.destroy();
    console.log('🎉 Cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanDatabase();
