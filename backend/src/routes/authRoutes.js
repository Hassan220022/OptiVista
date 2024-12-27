import express from 'express';
import { loginController, registerController } from '../controllers/authController.js';

const router = express.Router();

// Login a user
router.post('/login', loginController);

// Register a new user
router.post('/register', registerController);

export default router;