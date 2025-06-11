const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const User = require('../models/User');

// Enregistrer une nouvelle image
exports.saveImage = async (req, res) => {
  try {
    const { url, prompt, isPublic, tags } = req.body;
    const userId = req.user._id;

    // Créer une nouvelle image
    const image = new Image({
      userId,
      url,
      prompt,
      public: isPublic || false,
      tags: tags || []
    });

    await image.save();

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image', error: error.message });
  }
};

// Récupérer les images d'un utilisateur
exports.getUserImages = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const images = await Image.find({ userId })
      .sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des images', error: error.message });
  }
};

// Récupérer les images publiques
exports.getPublicImages = async (req, res) => {
  try {
    const { limit = 20, page = 1, tags } = req.query;
    const skip = (page - 1) * limit;

    let query = { public: true };
    
    // Filtrer par tags si spécifié
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    const images = await Image.find(query)
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Image.countDocuments(query);

    res.json({
      images,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des images publiques', error: error.message });
  }
};

// Télécharger une image à partir de données base64
exports.uploadBase64Image = async (req, res) => {
  try {
    const { base64Data, fileName, prompt, isPublic, tags } = req.body;
    const userId = req.user._id;

    if (!base64Data) {
      return res.status(400).json({ message: 'Données d\'image manquantes' });
    }

    // Extraire les données de l'image base64
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: 'Format d\'image base64 invalide' });
    }

    const type = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Créer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = type.split('/')[1] === 'jpeg' ? '.jpg' : `.${type.split('/')[1]}`;
    const uploadFileName = `image-${uniqueSuffix}${ext}`;
    const filePath = path.join(__dirname, '../uploads', uploadFileName);

    // Vérifier si le dossier uploads existe, sinon le créer
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Écrire le fichier
    fs.writeFileSync(filePath, buffer);

    // Générer l'URL publique
    const publicUrl = `/uploads/${uploadFileName}`;

    // Créer une nouvelle entrée d'image dans la base de données
    const image = new Image({
      userId,
      url: publicUrl,
      prompt,
      fileName: uploadFileName,
      filePath: filePath,
      public: isPublic || false,
      tags: tags || []
    });

    await image.save();

    // Déduire des crédits si nécessaire
    if (req.body.deductCredits) {
      const user = await User.findById(userId);
      user.credits -= req.body.deductCredits;
      await user.save();
    }

    res.status(201).json({
      image,
      credits: req.body.deductCredits ? req.user.credits - req.body.deductCredits : req.user.credits
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image', error: error.message });
  }
};

// Supprimer une image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Trouver l'image
    const image = await Image.findOne({ _id: id, userId });
    
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
    }

    // Supprimer le fichier si on a le chemin
    if (image.filePath && fs.existsSync(image.filePath)) {
      fs.unlinkSync(image.filePath);
    }

    // Supprimer l'entrée de la base de données
    await Image.deleteOne({ _id: id });

    res.json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image', error: error.message });
  }
};

// Mettre à jour une image (pour changer sa visibilité ou ses tags)
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic, tags } = req.body;
    const userId = req.user._id;

    const image = await Image.findOne({ _id: id, userId });
    
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée ou vous n\'êtes pas autorisé à la modifier' });
    }

    if (isPublic !== undefined) {
      image.public = isPublic;
    }

    if (tags) {
      image.tags = tags;
    }

    await image.save();

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'image', error: error.message });
  }
}; 