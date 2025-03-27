const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Public routes
router.get('/product/:productId', feedbackController.getProductFeedback);

// User routes (require authentication)
router.post('/', verifyToken, feedbackController.createFeedback);
router.get('/user', verifyToken, feedbackController.getUserFeedback);
router.put('/:id', verifyToken, feedbackController.updateFeedback);
router.delete('/:id', verifyToken, feedbackController.deleteFeedback);

// Admin routes
router.get('/', verifyToken, isAdmin, feedbackController.getAllFeedback);

module.exports = router; 