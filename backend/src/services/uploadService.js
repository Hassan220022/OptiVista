const minioClient = require('../config/minio');
const config = require('../config/appConfig');

export constuploadFile = async (bucket, filePath, objectName) => {
  await minioClient.fPutObject(bucket, objectName, filePath);
  return `http://${minioClient.endPoint}:${minioClient.port}/${bucket}/${objectName}`;
};
