const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate } = require('../middlewares/authMiddleware');

// Add feedback for a product
router.post('/', authenticate, feedbackController.addFeedback);

// Get feedback for a product
router.get('/:productId', feedbackController.getFeedbackForProduct);

module.exports = router;
