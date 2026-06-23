const express = require('express');
const collectionController = require('../controllers/collectionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/:id', collectionController.getCollection);

// Admin routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  collectionController.createCollection
);

router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  collectionController.updateCollection
);

router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  collectionController.deleteCollection
);

module.exports = router;
