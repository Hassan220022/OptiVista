import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js'; // Your backend entry file
import { pool } from './setup.js';
import path from 'path';

describe('File Upload API', () => {
  it('should upload a picture and store metadata in the database', async () => {
    const testImagePath = path.join(__dirname, 'test-image.png');

    const res = await request(app)
      .post('/api/upload') // Replace with your upload route
      .attach('file', testImagePath)
      .field('user_id', 1);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', true);

    // Verify database record
    const [rows] = await pool.query('SELECT * FROM pictures WHERE user_id = ?', [1]);
    expect(rows).to.have.length(1);
    expect(rows[0]).to.have.property('url');
    expect(rows[0].url).to.include('uploads/test-image.png');
  });
});
