import dotenv from 'dotenv';
import path from 'path';

// Load .env configuration from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { Client } from 'minio';

// Initialize MinIO client
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export default minioClient;
