import { pool } from './setup.js';

describe('Test Cleanup', () => {
  after(async () => {
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM pictures');
  });
});
