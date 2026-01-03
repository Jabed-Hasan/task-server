import 'reflect-metadata';
import 'dotenv/config';
import app from '../src/app';
import { initializeDatabase } from '../src/config/database';

// Initialize database connection
initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
});

// Export the Express app for Vercel serverless
export default app;
