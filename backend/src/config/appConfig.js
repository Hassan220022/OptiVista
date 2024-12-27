import path from 'path';
import dotenv from 'dotenv';

// Load .env configuration from two levels up
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const config = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  minioBucket: process.env.MINIO_BUCKET,
};

export default config;




// jwtSecret: 'your_jwt_secret',
// jwtExpiresIn: '1h',
// minioBucket: 'optivista',