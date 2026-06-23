const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please enter a product category'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  shortDescription: {
    type: String,
    required: [true, 'Please enter product short description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: [0, 'Discount price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'Please enter product SKU'],
    unique: true,
    trim: true,
    index: true
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one product image']
  }],
  weightOptions: {
    type: [String],
    default: ['250g', '500g', '1kg']
  },
  ratings: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isFestivalOffer: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-generate Slug before save if not present or modified
productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
