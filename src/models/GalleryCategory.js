const mongoose = require('mongoose');

const galleryCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a gallery category name'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GalleryCategory', galleryCategorySchema);
