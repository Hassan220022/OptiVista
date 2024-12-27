const db = require('../config/database');

exports.getAllProducts = async () => {
  const [rows] = await db.query(`SELECT * FROM products`);
  return rows;
};

exports.getProductById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);
  return rows[0];
};

exports.updateStock = async (id, stock) => {
  await db.query(`UPDATE products SET stock = ? WHERE id = ?`, [stock, id]);
};
