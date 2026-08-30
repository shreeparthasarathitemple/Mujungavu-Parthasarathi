const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  adminTitle: { type: String, required: true },
  adminDescription: { type: String, required: true },
  imageUrl: { type: String, required: true },
  generatedTitle: { type: String },
  generatedBlurb: { type: String },
  generatedContent: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
