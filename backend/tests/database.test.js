import { expect } from 'chai';
import db from '../config/database.js';

describe('Database Connection', () => {
  it('should successfully connect to the database and perform a simple query', async () => {
    try {
      const connection = await db.getConnection();
      expect(connection).to.be.an('object');

      const [rows] = await connection.query('SELECT 1 + 1 AS solution');
      expect(rows).to.be.an('array');
      expect(rows[0]).to.have.property('solution', 2);

      connection.release();
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  });
});