const mongoose = require('mongoose');

const PageViewSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PageView', PageViewSchema);
