const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide the offer title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide the offer description']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Please provide a discount percentage'],
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  bannerUrl: {
    type: String,
    required: [true, 'Please provide a promotional banner image URL']
  },
  offerType: {
    type: String,
    enum: ['diwali', 'eid', 'wedding', 'corporate', 'holi', 'navratri'],
    required: [true, 'Please specify the festival offer type']
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify when this offer starts']
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify when this offer expires']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
