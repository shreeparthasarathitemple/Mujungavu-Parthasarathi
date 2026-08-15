const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  titleEn: { type: String, required: true },
  titleKn: { type: String, required: true },
  descEn: { type: String, required: true },
  descKn: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Festival', festivalSchema);
