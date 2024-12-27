const db = require('../config/database');

exports.addToWishlist = async (userId, productId) => {
  await db.query(
    `INSERT INTO wishlist (user_id, product_id) 
     VALUES (?, ?)`,
    [userId, productId]
  );
};

exports.getWishlistByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM wishlist WHERE user_id = ?`,
    [userId]
  );
  return rows;
};
