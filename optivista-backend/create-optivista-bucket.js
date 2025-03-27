const { S3Client, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

// Create S3 client for MinIO
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin'
  },
  forcePathStyle: true
});

const BUCKET_NAME = 'optivista-files';

async function createBucket() {
  try {
    // Check if bucket exists
    console.log(`Checking if bucket '${BUCKET_NAME}' exists...`);
    const listResponse = await s3Client.send(new ListBucketsCommand({}));
    const bucketExists = listResponse.Buckets.some(
      bucket => bucket.Name === BUCKET_NAME
    );
    
    if (bucketExists) {
      console.log(`Bucket '${BUCKET_NAME}' already exists.`);
    } else {
      console.log(`Creating bucket '${BUCKET_NAME}'...`);
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createBucket();