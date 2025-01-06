import db from '../config/database.js';

export const getAllProducts = async () => {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

export const updateStock = async (id, stock) => {
  await db.query('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
};
