const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get current user's wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      // Create an empty wishlist for the user if they don't have one
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      status: 'success',
      products: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// Add product to user's wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      const err = new Error('Product ID is required');
      err.statusCode = 400;
      return next(err);
    }

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    // Check if product is already in the wishlist
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findOne({ user: req.user.id }).populate('products');

    res.status(200).json({
      status: 'success',
      message: 'Product added to wishlist successfully',
      products: populated.products
    });
  } catch (error) {
    next(error);
  }
};

// Remove product from user's wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      const err = new Error('Product ID is required');
      err.statusCode = 400;
      return next(err);
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.statusCode = 404;
      return next(err);
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    );
    await wishlist.save();

    const populated = await Wishlist.findOne({ user: req.user.id }).populate('products');

    res.status(200).json({
      status: 'success',
      message: 'Product removed from wishlist successfully',
      products: populated.products
    });
  } catch (error) {
    next(error);
  }
};
