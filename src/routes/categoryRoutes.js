const express = require('express');
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidations');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  validationMiddleware(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  validationMiddleware(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  categoryController.deleteCategory
);

module.exports = router;
