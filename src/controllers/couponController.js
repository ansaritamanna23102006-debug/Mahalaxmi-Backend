const Coupon = require('../models/Coupon');

// 1. Create Coupon (Admin only)
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      const err = new Error('Coupon code already exists');
      err.statusCode = 400;
      return next(err);
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate
    });

    res.status(201).json({
      status: 'success',
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update Coupon (Admin only)
exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, expiryDate, isActive } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      err.statusCode = 404;
      return next(err);
    }

    if (code) coupon.code = code.toUpperCase();
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.status(200).json({
      status: 'success',
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// 3. Delete Coupon (Admin only)
exports.deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 4. Validate Coupon (Available for users)
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || orderAmount === undefined) {
      const err = new Error('Please enter coupon code and order amount');
      err.statusCode = 400;
      return next(err);
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      const err = new Error('Coupon is invalid or has been deactivated');
      err.statusCode = 404;
      return next(err);
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      const err = new Error('Coupon has expired');
      err.statusCode = 400;
      return next(err);
    }

    // Check minimum order amount requirement
    if (orderAmount < coupon.minOrderAmount) {
      const err = new Error(`Minimum order amount of ₹${coupon.minOrderAmount} is required to use this coupon`);
      err.statusCode = 400;
      return next(err);
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round(orderAmount * (coupon.discountValue / 100));
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully!',
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get All Coupons (Admin only)
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};
