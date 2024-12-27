require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  minioBucket: process.env.MINIO_BUCKET || 'default_bucket',
};
