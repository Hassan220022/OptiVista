import express from 'express';
import { addFeedback, getFeedbackForProduct } from '../controllers/feedbackController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add feedback for a product
router.post('/', authenticate, addFeedback);

// Get feedback for a product
router.get('/:productId', getFeedbackForProduct);

export default router;