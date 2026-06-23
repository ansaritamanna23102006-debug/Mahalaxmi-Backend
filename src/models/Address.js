const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide the receiver name'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Please provide contact mobile number'],
    trim: true
  },
  addressLine: {
    type: String,
    required: [true, 'Please provide the street address'],
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide the city'],
    default: 'Mumbai',
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please provide the state'],
    default: 'Maharashtra',
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Please provide pincode'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);
