const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

// Generate a JWT
export constgenerateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// Verify a JWT
export constverifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
