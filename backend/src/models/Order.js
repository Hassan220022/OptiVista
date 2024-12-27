const db = require('../config/database');

exports.createOrder = async (userId, totalPrice, shippingAddress, paymentMethod) => {
  const [result] = await db.query(
    `INSERT INTO orders (user_id, total_price, shipping_address, payment_method) 
     VALUES (?, ?, ?, ?)`,
    [userId, totalPrice, shippingAddress, paymentMethod]
  );
  return result.insertId;
};

exports.getOrdersByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM orders WHERE user_id = ?`,
    [userId]
  );
  return rows;
};
