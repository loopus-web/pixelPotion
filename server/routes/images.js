const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { authenticateToken, checkCredits } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Route publique pour récupérer les images publiques
router.get('/public', imageController.getPublicImages);

// Routes nécessitant une authentification
router.use(authenticateToken);

// Routes de gestion des images
router.post('/', imageController.saveImage);
router.get('/', imageController.getUserImages);
router.get('/user/:userId', imageController.getUserImages);
router.post('/upload', imageController.uploadBase64Image);
router.delete('/:id', imageController.deleteImage);
router.put('/:id', imageController.updateImage);

// Route avec vérification des crédits (pour l'IA)
router.post('/generate', checkCredits, (req, res) => {
  // Cette route sera implémentée pour connecter à un service d'IA externe
  res.status(501).json({ message: 'Fonctionnalité non implémentée' });
});

module.exports = router; 