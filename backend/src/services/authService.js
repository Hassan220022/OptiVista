// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('../config/appConfig');

// exports.login = async (email, password) => {
//   const user = await User.findByEmail(email);

//   if (!user || !bcrypt.compareSync(password, user.password_hash)) {
//     throw new Error('Invalid email or password');
//   }

//   return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
//     expiresIn: config.jwtExpiresIn,
//   });
// };

// exports.register = async (username, email, password, role = 'customer') => {
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   return await User.createUser(username, email, hashedPassword, role);
// };
// services/authService.js
import jwt from '../utils/jwt.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const login = async (username, password) => {
  const user = await User.findByUsername(username);
  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };
  
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw { statusCode: 401, message: 'Invalid credentials' };
  
  const token = jwt.generateToken({ id: user.id, role: user.role });
  return token;
};

const register = async (userData) => {
  const existingUser = await User.findByUsername(userData.username);
  if (existingUser) throw { statusCode: 400, message: 'Username already exists' };
  
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await User.create({
    ...userData,
    password_hash: hashedPassword,
  });
  
  return newUser;
};

export default { login, register };