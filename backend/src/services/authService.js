import { findByEmail, createUser } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/appConfig.js';

export const login = async (email, password) => {
  const user = await findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw new Error('Invalid email or password');
  }
  console.log('User logged in successfully');
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const register = async (username, email, password, role = 'customer') => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return await createUser(username, email, hashedPassword, role);
};