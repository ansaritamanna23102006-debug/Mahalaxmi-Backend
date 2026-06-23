const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { uploadMultipleImages } = require('../services/uploadService');

// Helper to recalculate average ratings for a product
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
      reviewsCount: 0
    });
    return;
  }

  const totalRatingSum = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = parseFloat((totalRatingSum / reviews.length).toFixed(1));

  await Product.findByIdAndUpdate(productId, {
    ratings: averageRating,
    reviewsCount: reviews.length
  });
};

// 1. Write a Review (Verified Purchasers only)
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user.id;

    if (!productId || !rating || !reviewText) {
      const err = new Error('Product ID, star rating, and review text are required');
      err.statusCode = 400;
      return next(err);
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    // Verify if user is a purchaser of this product (delivered order check)
    const order = await Order.findOne({
      user: userId,
      orderStatus: 'delivered',
      'items.product': productId
    });

    if (!order) {
      const err = new Error('Only verified purchasers can submit a review for this sweet item.');
      err.statusCode = 403;
      return next(err);
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      const err = new Error('You have already submitted a review for this product');
      err.statusCode = 400;
      return next(err);
    }

    // Handle review images if uploaded
    let reviewImages = [];
    if (req.files && req.files.length > 0) {
      reviewImages = await uploadMultipleImages(req.files);
    }

    // Create Review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: parseInt(rating, 10),
      reviewText,
      images: reviewImages,
      isApproved: false // Admin must approve
    });

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully! It is pending administrator approval.',
      review
    });
  } catch (error) {
    next(error);
  }
};

// 2. Fetch Product Reviews (Only approved ones)
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// 2b. Fetch Recent Approved Reviews (Public — for homepage testimonials)
exports.getRecentApprovedReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const reviews = await Review.find({ isApproved: true })
      .populate('user', 'fullName profilePhoto')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};


// ================= ADMIN PANEL CONTROLS =================

// 3. Admin View All Reviews (Pending & Approved)
exports.adminGetAllReviews = async (req, res, next) => {
  try {
    const { isApproved } = req.query;
    const filter = {};
    if (isApproved !== undefined) {
      filter.isApproved = isApproved === 'true';
    }

    const reviews = await Review.find(filter)
      .populate('user', 'fullName email')
      .populate('product', 'name slug sku')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// 4. Admin Approve Review
exports.adminApproveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      const err = new Error('Review not found');
      err.statusCode = 404;
      return next(err);
    }

    review.isApproved = true;
    await review.save();

    // Recalculate average ratings for the product
    await updateProductRatings(review.product);

    res.status(200).json({
      status: 'success',
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// 5. Admin Reject Review (sets isApproved: false)
exports.adminRejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      const err = new Error('Review not found');
      err.statusCode = 404;
      return next(err);
    }

    review.isApproved = false;
    await review.save();

    // Recalculate average ratings for the product
    await updateProductRatings(review.product);

    res.status(200).json({
      status: 'success',
      message: 'Review rejected successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// 6. Admin Delete Review
exports.adminDeleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      const err = new Error('Review not found');
      err.statusCode = 404;
      return next(err);
    }

    // Recalculate ratings
    await updateProductRatings(review.product);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
