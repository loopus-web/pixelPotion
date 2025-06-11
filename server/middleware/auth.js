const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Vérification du token JWT
exports.authenticateToken = async (req, res, next) => {
  try {
    // Récupération du header d'autorisation
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé: Token manquant' });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Recherche de l'utilisateur dans la BDD
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Ajout de l'utilisateur à l'objet de requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée, veuillez vous reconnecter' });
    }
    
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier si l'utilisateur a suffisamment de crédits
exports.checkCredits = async (req, res, next) => {
  try {
    const user = req.user;
    const requiredCredits = req.body.requiredCredits || 1;
    
    if (user.credits < requiredCredits) {
      return res.status(402).json({ 
        message: 'Crédits insuffisants',
        creditsRequired: requiredCredits,
        creditsAvailable: user.credits
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la vérification des crédits' });
  }
}; 