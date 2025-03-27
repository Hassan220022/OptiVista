const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { verifyToken, isAdmin, isSeller } = require('../middlewares/auth.middleware');
const { validateFileType, validateFileSize } = require('../middlewares/upload.middleware');
const fileUpload = require('express-fileupload');

// Configure file upload middleware
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true
}));

// Define allowed file types for different upload categories
const imageFileTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const modelFileTypes = ['.glb', '.gltf', '.usdz', '.obj'];
const documentFileTypes = ['.pdf', '.doc', '.docx', '.txt'];
const allAllowedTypes = [...imageFileTypes, ...modelFileTypes, ...documentFileTypes];

// Public file retrieval - no authentication required
// Use wildcard parameter to capture the full path
router.get('/file/:path(*)', uploadController.getFile);

// Protected routes that require authentication
// General file upload
router.post('/file', 
  verifyToken, 
  validateFileSize(50 * 1024 * 1024), 
  validateFileType(allAllowedTypes), 
  uploadController.uploadFile
);

// Multiple files upload
router.post('/files', 
  verifyToken, 
  validateFileSize(50 * 1024 * 1024), 
  validateFileType(allAllowedTypes), 
  uploadController.uploadMultipleFiles
);

// Image-specific upload
router.post('/image', 
  verifyToken, 
  validateFileSize(10 * 1024 * 1024), 
  validateFileType(imageFileTypes), 
  uploadController.uploadFile
);

// 3D Model-specific upload
router.post('/model', 
  verifyToken, 
  validateFileSize(50 * 1024 * 1024), 
  validateFileType(modelFileTypes), 
  uploadController.uploadFile
);

// Delete file
router.delete('/file/:path(*)', verifyToken, uploadController.deleteFile);

// Routes for admin and sellers only
router.get('/files/:folder?', verifyToken, uploadController.listFiles);

module.exports = router; 