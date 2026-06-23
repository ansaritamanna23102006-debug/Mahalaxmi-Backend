const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { createProductSchema, updateProductSchema } = require('../validations/productValidations');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestsellers', productController.getBestSellers);
router.get('/festival', productController.getFestivalProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/related/:slug', productController.getRelatedProducts);

// Admin routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  upload.array('images', 5),
  validationMiddleware(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  upload.array('images', 5),
  validationMiddleware(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  productController.deleteProduct
);

module.exports = router;
