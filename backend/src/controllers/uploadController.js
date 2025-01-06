import minioClient from '../config/minio.js';
import config from '../config/appConfig.js';
import fs from 'fs/promises';
import db from '../config/database.js';

export const uploadFileToMinio = async (filePath, fileName) => {
  try {
    // Upload the file to MinIO
    await minioClient.fPutObject(config.minioBucket, fileName, filePath);

    // Generate the URL for the uploaded file
    const fileUrl = `http://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.minioBucket}/${fileName}`;

    // Delete the file from local storage after upload
    await fs.unlink(filePath);

    return fileUrl;
  } catch (error) {
    throw new Error('Error uploading file to MinIO: ' + error.message);
  }
};

export const savePictureMetadata = async (userId, fileUrl, mimeType, fileSize, metadata) => {
  try {
    const [result] = await db.query(
      'INSERT INTO pictures (user_id, url, mime_type, file_size, metadata) VALUES (?, ?, ?, ?, ?)',
      [userId, fileUrl, mimeType, fileSize, JSON.stringify(metadata)]
    );
    return result.insertId;
  } catch (error) {
    throw new Error('Error saving picture metadata: ' + error.message);
  }
};