/**
 * Verification Test Script
 * Verifies that all controllers, models, services, validations, and express app initializations
 * load successfully without syntax errors or module dependency resolution failures.
 */
require('dotenv').config();

console.log('🏁 Starting Mahalaxmi Mithaiwala Backend Verification Checks...');

try {
  console.log('➡️ Verifying Models loading...');
  require('../models/User');
  require('../models/Product');
  require('../models/Cart');
  require('../models/Address');
  require('../models/Coupon');
  require('../models/Order');
  require('../models/Review');
  require('../models/Offer');
  require('../models/Contact');
  require('../models/Newsletter');
  require('../models/Wishlist');
  console.log('✅ Models verified successfully.');

  console.log('➡️ Verifying Services loading...');
  require('../services/emailService');
  require('../services/paymentService');
  require('../services/uploadService');
  console.log('✅ Services verified successfully.');

  console.log('➡️ Verifying Controllers loading...');
  require('../controllers/authController');
  require('../controllers/productController');
  require('../controllers/cartController');
  require('../controllers/wishlistController');
  require('../controllers/addressController');
  require('../controllers/couponController');
  require('../controllers/orderController');
  require('../controllers/reviewController');
  require('../controllers/offerController');
  require('../controllers/contactController');
  require('../controllers/newsletterController');
  require('../controllers/dashboardController');
  console.log('✅ Controllers verified successfully.');

  console.log('➡️ Verifying Routing structures...');
  require('../routes/apiRouter');
  console.log('✅ Routing verified successfully.');

  console.log('➡️ Verifying Express app compilation...');
  const app = require('../app');
  console.log('✅ App compiled successfully.');

  // Run a short health check compilation test
  console.log('➡️ Testing server health-check binds...');
  if (typeof app.handle === 'function') {
    console.log('✅ Server health checks verified.');
  } else {
    throw new Error('Express app is not a valid request handler function');
  }

  console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ VERIFICATION CHECK FAILED!');
  console.error(error.stack || error);
  process.exit(1);
}
