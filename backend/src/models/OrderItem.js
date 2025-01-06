import db from '../config/database.js';

export const addOrderItem = async (orderId, productId, quantity, price) => {
  await db.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, price]
  );
};

export const getItemsByOrder = async (orderId) => {
  const [rows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  return rows;
};
