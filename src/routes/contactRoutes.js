const express = require('express');
const contactController = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { contactSubmitSchema } = require('../validations/otherValidations');

const router = express.Router();

// Public route to submit support ticket
router.post('/', validationMiddleware(contactSubmitSchema), contactController.submitInquiry);

// Admin-only inquiry trackers
router.get('/', protect, restrictTo('admin'), contactController.getInquiries);
router.put('/:id/resolve', protect, restrictTo('admin'), contactController.resolveInquiry);

module.exports = router;
