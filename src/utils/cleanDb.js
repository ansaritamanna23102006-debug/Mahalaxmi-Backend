const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Address = require('../models/Address');
const User = require('../models/User');

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahalaxmi');
    console.log('Connected to MongoDB for cleaning...');

    // Clear collections
    await Product.deleteMany({});
    console.log('Cleared all products.');

    await Category.deleteMany({});
    console.log('Cleared all categories.');

    await Order.deleteMany({});
    console.log('Cleared all orders.');

    await Coupon.deleteMany({});
    console.log('Cleared all coupons.');

    await Review.deleteMany({});
    console.log('Cleared all reviews.');

    await Cart.deleteMany({});
    console.log('Cleared all carts.');

    await Wishlist.deleteMany({});
    console.log('Cleared all wishlists.');

    await Address.deleteMany({});
    console.log('Cleared all addresses.');

    // Remove all users except administrators
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('Cleared all users (kept admin accounts).');

    console.log('\n🧹 Database successfully cleaned! Your store is now a clean slate.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    process.exit(1);
  }
};

cleanDB();
