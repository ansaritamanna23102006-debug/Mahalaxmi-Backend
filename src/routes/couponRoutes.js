const express = require('express');
const couponController = require('../controllers/couponController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { couponCreateSchema } = require('../validations/otherValidations');

const router = express.Router();

// Public route to validate coupon
router.post('/validate', couponController.validateCoupon);

// Admin-only coupon CRUD
router.use(protect, restrictTo('admin'));

router.get('/', couponController.getAllCoupons);
router.post('/', validationMiddleware(couponCreateSchema), couponController.createCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
