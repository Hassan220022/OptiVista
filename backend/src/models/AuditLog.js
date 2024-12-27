const db = require('../config/database');

exports.createLog = async (userId, action, details) => {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, details) 
     VALUES (?, ?, ?)`,
    [userId, action, details]
  );
};

exports.getLogsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM audit_logs WHERE user_id = ?`,
    [userId]
  );
  return rows;
};