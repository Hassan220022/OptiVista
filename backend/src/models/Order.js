import db from '../config/database.js';

export const createOrder = async (userId, totalPrice, shippingAddress, paymentMethod) => {
  const [result] = await db.query(
    'INSERT INTO orders (user_id, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
    [userId, totalPrice, shippingAddress, paymentMethod]
  );
  return result.insertId;
};

export const getOrdersByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
};