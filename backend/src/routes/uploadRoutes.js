const multer = require('multer');
const minioClient = require('../config/minio');
const config = require('../config/appConfig');

const upload = multer();

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const fileStream = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload directly to MinIO
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
