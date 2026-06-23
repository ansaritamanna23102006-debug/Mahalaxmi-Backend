const crypto = require('crypto');
const { getRazorpayInstance } = require('../config/razorpay');

// Create Razorpay Order
const createRazorpayOrder = async (receipt, amountInRupees) => {
  try {
    const razorpay = getRazorpayInstance();
    const options = {
      amount: Math.round(amountInRupees * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: receipt.toString(),
      payment_capture: 1 // Auto capture
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error.message);
    throw new Error(`Payment gateway order creation failed: ${error.message}`);
  }
};

// Cryptographic Verification of Razorpay Payment Signature
const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    // 1. If mock, always return true
    if (razorpayOrderId.startsWith('order_mock_')) {
      console.log('[MOCK PAYMENT] Verifying mock payment signatures successfully');
      return true;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret === 'mock_secret') {
      console.warn('Warning: Missing Razorpay Key Secret. Accepting signature as true (dev-mode fallback).');
      return true;
    }

    // 2. Generate HMAC SHA256 Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    return digest === razorpaySignature;
  } catch (error) {
    console.error('Razorpay signature verification exception:', error.message);
    return false;
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature
};
