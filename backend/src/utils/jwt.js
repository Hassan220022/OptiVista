const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

// Generate a JWT
exports.generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// Verify a JWT
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
