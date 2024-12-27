const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

exports.login = async (email, password) => {
  const user = await User.findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    throw new Error('Invalid email or password');
  }

  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

exports.register = async (username, email, password, role = 'customer') => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return await User.createUser(username, email, hashedPassword, role);
};