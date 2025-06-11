const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  prompt: {
    type: String
  },
  filePath: String,
  fileName: String,
  public: {
    type: Boolean,
    default: false
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema); 