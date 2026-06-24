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
  variants: [
    {
      weight: { type: String, required: true },
      price: { type: Number, required: true },
      discountPrice: { type: Number, default: 0 },
      stock: { type: Number, default: 100 }
    }
  ],
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
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

// Auto-generate Slug, SKU, short description and base price before validation
productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 150) + '...';
  }
  if (!this.sku) {
    const catCode = this.category ? this.category.toUpperCase().substring(0, 3).replace(/[^A-Z]/g, 'MM') : 'MM';
    this.sku = `MM-${catCode}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if (!this.price) {
    if (this.variants && this.variants.length > 0) {
      this.price = this.variants[0].price;
    } else {
      this.price = 0;
    }
  }
  // Sync the boolean flags if new fields are set
  if (this.featured !== undefined) {
    this.isFeatured = this.featured;
  }
  if (this.bestseller !== undefined) {
    this.isBestSeller = this.bestseller;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
