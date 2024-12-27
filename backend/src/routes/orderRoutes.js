import express from 'express';
import { createOrder, getOrdersByUser } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/', authenticate, createOrder);

// Get orders for a user
router.get('/:userId', authenticate, getOrdersByUser);

export default router;
