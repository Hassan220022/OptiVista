const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

async function uploadTestFile() {
  try {
    // Create a simple test file
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for MinIO upload.');
    
    // Read the file
    const fileContent = fs.readFileSync(testFilePath);
    
    // Upload to MinIO
    console.log(`Uploading test file to bucket '${BUCKET_NAME}'...`);
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: 'test-file.txt',
      Body: fileContent,
      ContentType: 'text/plain'
    };
    
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('File uploaded successfully.');
    
    // Clean up the local test file
    fs.unlinkSync(testFilePath);
    console.log('Local test file cleaned up.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

uploadTestFile();