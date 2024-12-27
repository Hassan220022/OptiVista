import express from 'express';
import { scheduleConsultation, getConsultationsByUser } from '../controllers/consultationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Schedule a consultation
router.post('/', authenticate, scheduleConsultation);

// Get consultations for a user
router.get('/:userId', authenticate, getConsultationsByUser);

export default router;