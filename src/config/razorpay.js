const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId === 'rzp_test_mock_key') {
    console.warn('Warning: Razorpay is using mock credentials. Payments will run in simulation/mock mode.');
    // Return a mock object to prevent startup failures in mock environment
    return {
      orders: {
        create: async (data) => {
          console.log('[MOCK RAZORPAY] Creating order:', data);
          return {
            id: `order_mock_${Math.random().toString(36).substring(2, 10)}`,
            amount: data.amount,
            currency: data.currency,
            receipt: data.receipt,
            status: 'created',
            created_at: Math.floor(Date.now() / 1000)
          };
        }
      },
      payments: {
        fetch: async (paymentId) => {
          console.log('[MOCK RAZORPAY] Fetching payment:', paymentId);
          return {
            id: paymentId,
            status: 'captured',
            amount: 10000,
            method: 'upi'
          };
        }
      }
    };
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayInstance;
};

module.exports = {
  getRazorpayInstance
};
