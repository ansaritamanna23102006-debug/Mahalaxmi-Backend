const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, optionalProtect, restrictTo } = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { orderCreateSchema } = require('../validations/otherValidations');

const router = express.Router();

// Webhook endpoint (Public, does raw crypto verification in controller)
router.post('/webhook', orderController.handleWebhook);

// Public track order route (guest tracking)
router.get('/track', orderController.trackOrder);

// Create order (Authenticated user or Guest checkout)
router.post(
  '/',
  optionalProtect,
  validationMiddleware(orderCreateSchema),
  orderController.createOrder
);

// Verify Razorpay payment signature
router.post('/verify-payment', orderController.verifyPayment);

// Authenticated user routes
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.post('/:id/cancel', protect, orderController.cancelOrder);

// Admin-only order controls
router.get('/', protect, restrictTo('admin'), orderController.adminGetOrders);
router.put('/:id/status', protect, restrictTo('admin'), orderController.adminUpdateStatus);
router.post('/:id/refund', protect, restrictTo('admin'), orderController.adminProcessRefund);

module.exports = router;
