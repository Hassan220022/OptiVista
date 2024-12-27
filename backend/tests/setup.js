import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const resetDatabase = async () => {
  // Clear and reset database tables
  await pool.query('DELETE FROM products');
  await pool.query('DELETE FROM pictures');
};

before(async () => {
  console.log('Connecting to test database...');
  await resetDatabase();
});

after(async () => {
  console.log('Closing test database connection...');
  await pool.end();
});
