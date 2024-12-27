import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFileToMinio } from './src/controllers/uploadController.js';

// Get the current directory name (to resolve the path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testUpload = async () => {
  // Specify the local file path and desired file name
  const filePath = path.resolve(__dirname, 'testImage.png'); // Update with your image file path
  const fileName = 'testImage.png'; // Desired file name in MinIO

  try {
    const uploadedFileUrl = await uploadFileToMinio(filePath, fileName);
    console.log('File uploaded successfully: ', uploadedFileUrl);
  } catch (error) {
    console.error('Error during file upload: ', error.message);
  }
};

testUpload();
