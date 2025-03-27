const { S3Client, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

// Create S3 client for MinIO
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1', // MinIO requires any region
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin'
  },
  forcePathStyle: true // Needed for MinIO
});

async function testMinIO() {
  try {
    // Check if buckets exist
    console.log('Listing buckets...');
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    console.log('Current buckets:', listBucketsResponse.Buckets.map(b => b.Name));
    
    // Create a test bucket
    const bucketName = 'optivista-test-' + Date.now();
    console.log(`Creating bucket: ${bucketName}`);
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket '${bucketName}' created successfully`);
    
    // List buckets again
    const updatedListResponse = await s3Client.send(new ListBucketsCommand({}));
    console.log('Updated buckets list:', updatedListResponse.Buckets.map(b => b.Name));
    
    console.log('MinIO test completed successfully');
  } catch (error) {
    console.error('Error testing MinIO:', error);
  }
}

testMinIO();