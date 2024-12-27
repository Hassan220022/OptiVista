const minioClient = require('../config/minio');
const config = require('../config/appConfig');
const fs = require('fs').promises;

exports.uploadFileToMinio = async (filePath, fileName) => {
  try {
    await minioClient.fPutObject(config.minioBucket, fileName, filePath);

    // Delete the file from local storage after upload
    await fs.unlink(filePath);

    return `http://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.minioBucket}/${fileName}`;
  } catch (error) {
    throw new Error('Error uploading file to MinIO: ' + error.message);
  }
};
