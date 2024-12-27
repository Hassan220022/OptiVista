import express from 'express';
import { createSession, getSessionsByUser } from '../controllers/arController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create an AR session
router.post('/', authenticate, createSession);

// Get AR sessions for a user
router.get('/:userId', authenticate, getSessionsByUser);

export default router;
