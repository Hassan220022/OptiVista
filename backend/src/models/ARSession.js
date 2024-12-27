import db from '../config/database.js';

export const createSession = async (userId, productId, snapshots, sessionMetadata) => {
  const [result] = await db.query(
    `INSERT INTO ar_sessions (user_id, product_id, snapshots, session_metadata) 
     VALUES (?, ?, ?, ?)`,
    [userId, productId, JSON.stringify(snapshots), JSON.stringify(sessionMetadata)]
  );
  return result.insertId;
};

export const getSessionsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM ar_sessions WHERE user_id = ?`,
    [userId]
  );
  return rows;
};
