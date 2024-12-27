import db from '../config/database.js';

// Rename `createSession` to `scheduleConsultation` for consistency
export const scheduleConsultation = async (userId, productId, snapshots, sessionMetadata) => {
  const [result] = await db.query(
    `INSERT INTO ar_sessions (user_id, product_id, snapshots, session_metadata) 
     VALUES (?, ?, ?, ?)`,
    [userId, productId, JSON.stringify(snapshots), JSON.stringify(sessionMetadata)]
  );
  return result.insertId;
};

// Rename `getSessionsByUser` to `getConsultationsByUser`
export const getConsultationsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM ar_sessions WHERE user_id = ?`,
    [userId]
  );
  return rows;
};