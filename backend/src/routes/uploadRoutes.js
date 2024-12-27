import express from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/authMiddleware.js';
import minioClient from '../config/minio.js';
import config from '../config/appConfig.js';

const router = express.Router();
const upload = multer();

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const fileStream = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    await minioClient.putObject(config.minioBucket, fileName, fileStream);
    res.status(200).json({
      success: true,
      url: `http://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.minioBucket}/${fileName}`,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
