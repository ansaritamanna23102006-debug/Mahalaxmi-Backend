const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Nullable for guest checkouts
  },
  guestEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, default: 'Mumbai' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true }
  },
  subtotal: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'net', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Auto-generate short order ID MM-XXXXXX pre-validate
orderSchema.pre('validate', function (next) {
  if (!this.orderId) {
    const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
    this.orderId = `MM-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
