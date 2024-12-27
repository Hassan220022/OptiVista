import db from '../config/database.js';

export const findByEmail = async (email) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
};

export const createUser = async (username, email, passwordHash, role) => {
  const [result] = await db.query(
    `INSERT INTO users (username, email, password_hash, role) 
     VALUES (?, ?, ?, ?)`,
    [username, email, passwordHash, role]
  );
  return result.insertId;
};
