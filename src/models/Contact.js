const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your contact number'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject line'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please enter your message text']
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
