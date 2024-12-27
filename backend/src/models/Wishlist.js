import db from '../config/database.js';

export const addToWishlist = async (userId, productId) => {
  await db.query(
    `INSERT INTO wishlist (user_id, product_id) 
     VALUES (?, ?)`,
    [userId, productId]
  );
};

export const getWishlistByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM wishlist WHERE user_id = ?`,
    [userId]
  );
  return rows;
};