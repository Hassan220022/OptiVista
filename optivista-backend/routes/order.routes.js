const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// User routes (require authentication)
router.post('/', verifyToken, orderController.createOrder);
router.get('/user', verifyToken, orderController.getUserOrders);
router.get('/user/:id', verifyToken, orderController.getOrderById);

// Admin routes
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router; 