const db = require('../config/database');

exports.scheduleConsultation = async (userId, consultantId, date, details, status = 'scheduled') => {
  const [result] = await db.query(
    `INSERT INTO consultations (user_id, consultant_id, consultation_date, details, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, consultantId, date, details, status]
  );
  return result.insertId;
};

exports.getConsultationsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM consultations WHERE user_id = ?`,
    [userId]
  );
  return rows;
};
