const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper to calculate cart subtotal, shipping, and discount totals
const calculateCartTotals = async (cart, couponCode = null) => {
  let subtotal = 0;
  
  // Calculate subtotal from products
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      // Use discount price if it exists and is valid
      const activePrice = (product.discountPrice && product.discountPrice > 0) 
        ? product.discountPrice 
        : product.price;
      
      item.price = activePrice; // update in cart item
      subtotal += activePrice * item.quantity;
    }
  }

  cart.subtotal = subtotal;

  // Calculate discount if coupon is applied
  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiryDate: { $gt: Date.now() } });
    if (coupon && subtotal >= coupon.minOrderAmount) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round(subtotal * (coupon.discountValue / 100));
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }
    }
  }
  cart.discount = discount;

  // Free shipping above Rs. 1000, else Rs. 80. (0 shipping if cart is empty)
  cart.shippingCharge = (subtotal === 0 || subtotal > 1000) ? 0 : 80;
  cart.total = Math.max(0, subtotal - discount + cart.shippingCharge);

  return cart;
};

// Get user or guest cart
exports.getCart = async (req, res, next) => {
  try {
    const guestId = req.headers['x-guest-id'] || req.query.guestId;
    const userId = req.user ? req.user.id : null;
    const couponCode = req.query.couponCode;

    let cart = null;
    
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.product');
    } else if (guestId) {
      cart = await Cart.findOne({ guestId }).populate('items.product');
    }

    if (!cart) {
      // Return empty cart format if none exists yet
      return res.status(200).json({
        status: 'success',
        cart: { items: [], subtotal: 0, discount: 0, shippingCharge: 0, total: 0 }
      });
    }

    // Recalculate totals to make sure pricing and stock are up to date
    cart = await calculateCartTotals(cart, couponCode);
    await cart.save();

    res.status(200).json({
      status: 'success',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Save whole cart (sync/override)
exports.saveCart = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const userId = req.user ? req.user.id : null;

    if (!userId && !guestId) {
      const err = new Error('Identify session using User token or x-guest-id header');
      err.statusCode = 400;
      return next(err);
    }

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      cart = new Cart(userId ? { user: userId } : { guestId });
    }

    // Map incoming items, ensuring price is fetched from Product database
    const cartItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product || item.productId);
      if (product) {
        const activePrice = (product.discountPrice && product.discountPrice > 0) 
          ? product.discountPrice 
          : product.price;
        
        cartItems.push({
          product: product._id,
          quantity: item.quantity,
          weight: item.weight || '500g',
          price: activePrice
        });
      }
    }

    cart.items = cartItems;
    cart = await calculateCartTotals(cart, couponCode);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Cart saved successfully',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

// Add single item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, weight = '500g', couponCode } = req.body;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const userId = req.user ? req.user.id : null;

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

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      cart = new Cart(userId ? { user: userId } : { guestId });
    }

    // Check if item with same productId and weight is already in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.weight === weight
    );

    const activePrice = (product.discountPrice && product.discountPrice > 0) 
      ? product.discountPrice 
      : product.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += parseInt(quantity, 10);
      cart.items[itemIndex].price = activePrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity, 10),
        weight,
        price: activePrice
      });
    }

    cart = await calculateCartTotals(cart, couponCode);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity or change weight options
exports.updateCartQuantity = async (req, res, next) => {
  try {
    const { productId, weight, quantity, newWeight, couponCode } = req.body;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const userId = req.user ? req.user.id : null;

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      const err = new Error('Cart not found');
      err.statusCode = 404;
      return next(err);
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.weight === weight
    );

    if (itemIndex === -1) {
      const err = new Error('Item not found in cart');
      err.statusCode = 404;
      return next(err);
    }

    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = parseInt(quantity, 10);
    }

    if (newWeight !== undefined) {
      cart.items[itemIndex].weight = newWeight;
    }

    // Filter out items with 0 or negative quantities
    cart.items = cart.items.filter(item => item.quantity > 0);

    cart = await calculateCartTotals(cart, couponCode);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

// Remove single item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId, weight, couponCode } = req.body;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const userId = req.user ? req.user.id : null;

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      const err = new Error('Cart not found');
      err.statusCode = 404;
      return next(err);
    }

    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId && item.weight === weight)
    );

    cart = await calculateCartTotals(cart, couponCode);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};
