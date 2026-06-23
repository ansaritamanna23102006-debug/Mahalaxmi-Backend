const express = require('express');
const offerController = require('../controllers/offerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public route to fetch currently active marketing campaigns
router.get('/', offerController.getOffers);

// Admin-only offer setups
router.get('/admin', protect, restrictTo('admin'), offerController.adminGetAllOffers);
router.post('/', protect, restrictTo('admin'), upload.single('banner'), offerController.createOffer);
router.put('/:id', protect, restrictTo('admin'), upload.single('banner'), offerController.updateOffer);
router.delete('/:id', protect, restrictTo('admin'), offerController.deleteOffer);

module.exports = router;
