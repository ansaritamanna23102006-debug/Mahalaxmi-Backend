const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public route to view approved reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

// Public route: Recent approved reviews for homepage testimonials
router.get('/', reviewController.getRecentApprovedReviews);

// Write a review (Requires purchase verification and token)
router.post(
  '/',
  protect,
  upload.array('images', 3),
  reviewController.addReview
);

// Admin-only review management panels
router.get('/admin', protect, restrictTo('admin'), reviewController.adminGetAllReviews);
router.put('/:id/approve', protect, restrictTo('admin'), reviewController.adminApproveReview);
router.put('/:id/reject', protect, restrictTo('admin'), reviewController.adminRejectReview);
router.delete('/:id', protect, restrictTo('admin'), reviewController.adminDeleteReview);

module.exports = router;
