const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.authProvider;
    }
  },
  authProvider: {
    type: String,
    enum: ['google', 'github', 'discord', null],
    default: null
  },
  providerUserId: {
    type: String,
    sparse: true
  },
  username: {
    type: String,
    trim: true
  },
  firstName: String,
  lastName: String,
  profilePicture: String,
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'pro'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook pour hashage du mot de passe
UserSchema.pre('save', async function(next) {
  const user = this;
  
  if (user.isModified('password') && user.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Méthode pour vérification du mot de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema); 