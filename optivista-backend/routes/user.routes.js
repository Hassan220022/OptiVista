const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// User profile routes
router.get('/profile/:id', verifyToken, userController.getUserById);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/password', verifyToken, userController.changePassword);

// Admin routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router; 