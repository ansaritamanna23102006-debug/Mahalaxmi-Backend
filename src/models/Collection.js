const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the collection title'],
    trim: true
  },
  tagline: {
    type: String,
    required: [true, 'Please provide the collection tagline'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide the collection description']
  },
  image: {
    type: String,
    required: [true, 'Please provide the collection image URL']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);
