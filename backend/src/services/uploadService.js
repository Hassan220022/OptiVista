import minioClient from '../config/minio';
import config from '../config/appConfig';

export const uploadFile = async (bucket, filePath, objectName) => {
  await minioClient.fPutObject(bucket, objectName, filePath);
  return `http://${minioClient.endPoint}:${minioClient.port}/${bucket}/${objectName}`;
};
