const db = require('../config/database');

exports.addFeedback = async (userId, productId, rating, review) => {
  await db.query(
    `INSERT INTO feedback (user_id, product_id, rating, review) 
     VALUES (?, ?, ?, ?)`,
    [userId, productId, rating, review]
  );
};

exports.getFeedbackForProduct = async (productId) => {
  const [rows] = await db.query(
    `SELECT * FROM feedback WHERE product_id = ?`,
    [productId]
  );
  return rows;
};
