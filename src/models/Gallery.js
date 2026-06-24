const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for this gallery image'],
    trim: true,
    default: 'Shop Interior'
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide the image URL']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
