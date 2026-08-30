const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  en: { type: String },
  kn: { type: String }
}, { _id: false });

const newsSchema = new mongoose.Schema({
  adminTitle: { type: String, required: true },
  adminDescription: { type: String, required: true },
  imageUrl: { type: String, required: true },
  generatedTitle: translationSchema,
  generatedBlurb: translationSchema,
  generatedContent: translationSchema,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
