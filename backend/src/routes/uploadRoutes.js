import express from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadFileToMinio, savePictureMetadata } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.user; // Assuming the user ID is available in the request
    const filePath = req.file.path;
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload the file to MinIO
    const fileUrl = await uploadFileToMinio(filePath, fileName);

    // Save the file metadata in the database
    const pictureId = await savePictureMetadata(
      userId,
      fileUrl,
      req.file.mimetype,
      req.file.size,
      { description: 'Uploaded file' }
    );

    res.status(200).json({
      success: true,
      url: fileUrl,
      pictureId,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;