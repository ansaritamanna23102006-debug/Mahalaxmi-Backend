const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mahalaxmi');
    console.log('Connected to MongoDB...');

    // Remove existing admin if any
    await User.deleteOne({ email: 'admin@mahalaxmimithaiwala.com' });
    console.log('Removed existing admin (if any).');

    // Let the User model's pre-save hook handle bcrypt hashing automatically
    // DO NOT manually hash here — the schema will hash on save
    await User.create({
      fullName: 'Mahalaxmi Admin',
      email: 'admin@mahalaxmimithaiwala.com',
      mobileNumber: '9999999999',
      password: 'Admin@1982',
      role: 'admin',
      isVerified: true
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('──────────────────────────────────');
    console.log('  Email    : admin@mahalaxmimithaiwala.com');
    console.log('  Password : Admin@1982');
    console.log('  Role     : admin');
    console.log('──────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
