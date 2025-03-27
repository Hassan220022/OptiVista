const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

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

async function listObjects() {
  try {
    console.log(`Listing objects in bucket '${BUCKET_NAME}'...`);
    const response = await s3Client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME })
    );
    
    if (response.Contents && response.Contents.length > 0) {
      console.log('Objects in bucket:');
      response.Contents.forEach(item => {
        console.log(`- ${item.Key} (Size: ${item.Size} bytes, Last Modified: ${item.LastModified})`);
      });
    } else {
      console.log('No objects found in bucket.');
    }
  } catch (error) {
    console.error('Error listing objects:', error);
  }
}

listObjects();