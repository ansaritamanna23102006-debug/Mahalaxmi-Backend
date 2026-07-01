const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(galleryController.getAllGalleryImages)
  .post(protect, restrictTo('admin'), upload.single('image'), galleryController.uploadGalleryImage);

router.route('/categories')
  .get(galleryController.getGalleryCategories)
  .post(protect, restrictTo('admin'), galleryController.createGalleryCategory);

router.route('/categories/:id')
  .delete(protect, restrictTo('admin'), galleryController.deleteGalleryCategory);

router.route('/:id')
  .delete(protect, restrictTo('admin'), galleryController.deleteGalleryImage);

module.exports = router;
