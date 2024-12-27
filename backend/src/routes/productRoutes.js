import express from 'express';
import { getAllProductsController, getProductByIdController } from '../controllers/productController.js';

const router = express.Router();

// Get all products
router.get('/', getAllProductsController);

// Get a specific product by ID
router.get('/:id', getProductByIdController);

export default router;