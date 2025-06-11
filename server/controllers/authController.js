const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      email,
      password,
      subscriptionPlan: 'free',
      credits: 20
    });

    await user.save();

    // Générer un token pour le nouvel utilisateur
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        profilePicture: user.profilePicture,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};

// Authentification avec un fournisseur (Google, GitHub, etc.)
exports.providerAuth = async (req, res) => {
  try {
    const { email, providerId, provider, name, picture } = req.body;

    if (!email || !providerId || !provider) {
      return res.status(400).json({ message: 'Informations de connexion incomplètes' });
    }

    // Rechercher ou créer l'utilisateur
    let user = await User.findOne({ email });

    if (!user) {
      // Créer un nouvel utilisateur
      user = new User({
        email,
        authProvider: provider,
        providerUserId: providerId,
        username: name,
        profilePicture: picture,
        subscriptionPlan: 'free',
        credits: 20
      });
    } else {
      // Mettre à jour les infos du fournisseur si nécessaire
      user.authProvider = provider;
      user.providerUserId = providerId;
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
      }
      if (name && !user.username) {
        user.username = name;
      }
    }

    await user.save();

    // Générer un token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        profilePicture: user.profilePicture,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'authentification', error: error.message });
  }
};

// Récupération de l'utilisateur actuel
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      id: user._id,
      email: user.email,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      profilePicture: user.profilePicture,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
}; 