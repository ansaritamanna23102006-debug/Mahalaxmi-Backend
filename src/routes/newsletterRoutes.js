const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { newsletterSchema } = require('../validations/otherValidations');

const router = express.Router();

// Public subscription routes
router.post('/subscribe', validationMiddleware(newsletterSchema), newsletterController.subscribe);
router.post('/unsubscribe', validationMiddleware(newsletterSchema), newsletterController.unsubscribe);

// Admin-only list trackers
router.get('/list', protect, restrictTo('admin'), newsletterController.getSubscribersList);
router.get('/export', protect, restrictTo('admin'), newsletterController.exportSubscribers);

module.exports = router;
