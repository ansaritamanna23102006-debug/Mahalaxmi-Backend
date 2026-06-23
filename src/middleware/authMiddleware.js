const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Extract token from Authorization headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      const err = new Error('You are not logged in! Please log in to gain access.');
      err.statusCode = 401;
      return next(err);
    }

    // 2. Cryptographic signature check
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_access_token_key_1982');

    // 3. Check if user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const err = new Error('The user belonging to this token no longer exists.');
      err.statusCode = 401;
      return next(err);
    }

    // 4. Attach user model to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if token exists, verify it, but do not throw error if missing (for guest-cart checkout integrations)
const optionalProtect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_access_token_key_1982');
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        req.user = currentUser;
      }
    }
    next();
  } catch (error) {
    // If invalid token, just proceed as guest rather than crashing
    next();
  }
};

// Role authorization restrictions helper (e.g. restrictTo('admin'))
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error('You do not have permission to perform this action');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  restrictTo
};
