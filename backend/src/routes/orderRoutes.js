const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

// Create a new order
router.post('/', authenticate, orderController.createOrder);

// Get orders for a user
router.get('/:userId', authenticate, orderController.getOrdersByUser);

module.exports = router;
