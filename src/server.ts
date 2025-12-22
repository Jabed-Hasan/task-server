import 'reflect-metadata';
import 'dotenv/config';
import app from './app';
import config from './config';
import { Server } from 'http';
import { initializeDatabase } from './config/database';

async function main() {
  // Initialize database connection
  await initializeDatabase();
  
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
}

main();
