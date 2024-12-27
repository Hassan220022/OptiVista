const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get a specific product by ID
router.get('/:id', productController.getProductById);

module.exports = router;
