const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login a user
router.post('/login', authController.login);

// Register a new user
router.post('/register', authController.register);

module.exports = router;
