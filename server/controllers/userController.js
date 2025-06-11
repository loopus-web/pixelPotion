const User = require('../models/User');

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { username, firstName, lastName } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour des champs fournis
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profilePicture,
      credits: updatedUser.credits,
      subscriptionPlan: updatedUser.subscriptionPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};

// Mettre à jour le plan d'abonnement
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan } = req.body;
    const userId = req.user._id;

    if (!['free', 'basic', 'premium', 'pro'].includes(subscriptionPlan)) {
      return res.status(400).json({ message: 'Plan d\'abonnement invalide' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.subscriptionPlan = subscriptionPlan;
    
    // Ajouter des crédits bonus selon le plan
    if (subscriptionPlan === 'basic') {
      user.credits += 50;
    } else if (subscriptionPlan === 'premium') {
      user.credits += 200;
    } else if (subscriptionPlan === 'pro') {
      user.credits += 500;
    }

    await user.save();

    res.json({
      id: user._id,
      subscriptionPlan: user.subscriptionPlan,
      credits: user.credits
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'abonnement', error: error.message });
  }
};

// Mettre à jour les crédits de l'utilisateur
exports.updateCredits = async (req, res) => {
  try {
    const { amount, operation } = req.body;
    const userId = req.user._id;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajouter ou déduire des crédits
    if (operation === 'add') {
      user.credits += amount;
    } else if (operation === 'deduct') {
      if (user.credits < amount) {
        return res.status(402).json({ 
          message: 'Crédits insuffisants',
          creditsRequired: amount,
          creditsAvailable: user.credits
        });
      }
      user.credits -= amount;
    } else {
      return res.status(400).json({ message: 'Opération invalide' });
    }

    await user.save();

    res.json({
      id: user._id,
      credits: user.credits
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des crédits', error: error.message });
  }
};

// Récupérer le profil d'un utilisateur
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
}; 