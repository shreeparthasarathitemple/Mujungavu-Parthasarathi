const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
