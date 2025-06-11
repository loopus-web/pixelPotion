const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes de profil
router.get('/profile', userController.getProfile);
router.get('/profile/:id', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Routes de gestion de l'abonnement et des crédits
router.put('/subscription', userController.updateSubscription);
router.put('/credits', userController.updateCredits);

module.exports = router; 