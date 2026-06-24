const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(galleryController.getAllGalleryImages)
  .post(protect, restrictTo('admin'), upload.single('image'), galleryController.uploadGalleryImage);

router.route('/:id')
  .delete(protect, restrictTo('admin'), galleryController.deleteGalleryImage);

module.exports = router;
