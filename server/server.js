const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Chargement des variables d'environnement
dotenv.config();

// Création du dossier .env s'il n'existe pas
if (!fs.existsSync('./.env')) {
  fs.writeFileSync('./.env', `PORT=5000
MONGODB_URI=mongodb://localhost:27017/pixPotion
JWT_SECRET=your_jwt_secret_key_replace_in_production
NODE_ENV=development`);
}

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const imageRoutes = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dossier pour les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixPotion')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API PixPotion fonctionnelle' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 