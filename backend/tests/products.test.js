import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js'; // Your backend entry file
import { pool } from './setup.js';

describe('Products API', () => {
  before(async () => {
    // Seed test data
    await pool.query('INSERT INTO categories (id, name) VALUES (?, ?)', [1, 'Sunglasses']);
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Stylish Shades',
      category_id: 1,
      price: 99.99,
      stock: 10,
    };

    const res = await request(app)
      .post('/api/products') // Replace with your product creation route
      .send(productData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('success', true);
    expect(res.body.data).to.have.property('id');

    // Verify database record
    const [rows] = await pool.query('SELECT * FROM products WHERE name = ?', [productData.name]);
    expect(rows).to.have.length(1);
    expect(rows[0]).to.have.property('price', productData.price);
  });

  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('data').that.is.an('array');
    expect(res.body.data).to.have.length.above(0);
  });
});
