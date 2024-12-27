const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/authMiddleware');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload a file
router.post('/', authenticate, upload.single('file'), uploadController.uploadFile);

module.exports = router;
