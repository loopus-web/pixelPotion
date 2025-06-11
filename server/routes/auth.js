const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/provider', authController.providerAuth);

// Routes protégées
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router; 