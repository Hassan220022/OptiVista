const { S3Client } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

// MinIO configuration
const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true' || false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET_NAME || 'optivista'
};

// Create S3 client for MinIO
const s3Client = new S3Client({
  endpoint: `http${minioConfig.useSSL ? 's' : ''}://${minioConfig.endPoint}:${minioConfig.port}`,
  region: 'us-east-1', // MinIO requires any region
  credentials: {
    accessKeyId: minioConfig.accessKey,
    secretAccessKey: minioConfig.secretKey
  },
  forcePathStyle: true // Needed for MinIO
});

// Initialize buckets
const initBuckets = async () => {
  try {
    const { ListBucketsCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
    
    // Check if bucket exists
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    const bucketExists = listBucketsResponse.Buckets.some(
      bucket => bucket.Name === minioConfig.bucketName
    );
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      await s3Client.send(new CreateBucketCommand({ Bucket: minioConfig.bucketName }));
      console.log(`Bucket '${minioConfig.bucketName}' created successfully`);
    } else {
      console.log(`Bucket '${minioConfig.bucketName}' already exists`);
    }
  } catch (error) {
    console.error('Error initializing MinIO buckets:', error);
  }
};

module.exports = {
  s3Client,
  minioConfig,
  initBuckets
}; 