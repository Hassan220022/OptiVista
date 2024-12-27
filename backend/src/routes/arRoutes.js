const express = require('express');
const router = express.Router();
const arController = require('../controllers/arController');
const { authenticate } = require('../middlewares/authMiddleware');

// Create an AR session
router.post('/', authenticate, arController.createSession);

// Get AR sessions for a user
router.get('/:userId', authenticate, arController.getSessionsByUser);

module.exports = router;
