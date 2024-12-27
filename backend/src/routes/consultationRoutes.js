const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authenticate } = require('../middlewares/authMiddleware');

// Schedule a consultation
router.post('/', authenticate, consultationController.scheduleConsultation);

// Get consultations for a user
router.get('/:userId', authenticate, consultationController.getConsultationsByUser);

module.exports = router;
