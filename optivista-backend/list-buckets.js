const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

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

async function listBuckets() {
  try {
    console.log('Listing MinIO buckets...');
    const response = await s3Client.send(new ListBucketsCommand({}));
    if (response.Buckets && response.Buckets.length > 0) {
      console.log('Available buckets:');
      response.Buckets.forEach(bucket => {
        console.log(`- ${bucket.Name} (Created: ${bucket.CreationDate})`);
      });
    } else {
      console.log('No buckets found.');
    }
  } catch (error) {
    console.error('Error listing buckets:', error);
  }
}

listBuckets();