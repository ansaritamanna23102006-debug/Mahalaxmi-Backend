const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, generateCryptoToken } = require('../utils/helpers');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const { uploadImage } = require('../services/uploadService');

// Cookie options for Refresh Token
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days matching JWT Refresh Expire
};

// 1. User Registration
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('Email address is already registered');
      err.statusCode = 400;
      return next(err);
    }

    // Generate Verification Token
    const verificationToken = generateCryptoToken();
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create User
    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password,
      verificationToken,
      verificationTokenExpires
    });

    // Send Verification Email
    try {
      await sendVerificationEmail(user.email, user.fullName, verificationToken);
    } catch (emailErr) {
      console.error('Registration email failed to send:', emailErr.message);
    }

    // Generate JWT Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Verification email sent.',
      accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. User Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      const err = new Error('Please provide email and password');
      err.statusCode = 400;
      return next(err);
    }

    // Check user & match password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      return next(err);
    }

    // Generate JWT Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. User Logout
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      // Find user by token and clear it
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Clear client cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 4. Email Verification
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      const err = new Error('Verification token is missing');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      const err = new Error('Verification token is invalid or has expired');
      err.statusCode = 400;
      return next(err);
    }

    // Update user properties
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email address verified successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// 5. Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('There is no user registered with that email address');
      err.statusCode = 404;
      return next(err);
    }

    // Generate and save recovery token
    const resetToken = generateCryptoToken();
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save({ validateBeforeSave: false });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetToken);
      res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email address'
      });
    } catch (emailErr) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      const err = new Error('Could not send password reset email. Please try again later.');
      err.statusCode = 500;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// 6. Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      const err = new Error('Reset token is missing');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      const err = new Error('Reset token is invalid or has expired');
      err.statusCode = 400;
      return next(err);
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save(); // Password gets hashed pre-save

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// 7. Refresh Access Token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      const err = new Error('Refresh token is missing. Please log in.');
      err.statusCode = 401;
      return next(err);
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      const err = new Error('Invalid refresh token session');
      err.statusCode = 403;
      return next(err);
    }

    // Generate new Access and Refresh tokens
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.status(200).json({
      status: 'success',
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// 8. Get User Profile
exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// 9. Update User Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, mobileNumber } = req.body;
    const user = await User.findById(req.user.id);

    if (fullName) user.fullName = fullName;
    if (mobileNumber) user.mobileNumber = mobileNumber;

    // Handle profile photo upload if file exists
    if (req.file) {
      const photoUrl = await uploadImage(req.file);
      user.profilePhoto = photoUrl;
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// 10. Change Password (protected)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      const err = new Error('Please provide current password and new password');
      err.statusCode = 400;
      return next(err);
    }

    if (newPassword.length < 6) {
      const err = new Error('New password must be at least 6 characters');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user || !(await user.matchPassword(currentPassword))) {
      const err = new Error('Incorrect current password');
      err.statusCode = 401;
      return next(err);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 11. Admin — Get All Users
exports.adminGetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password -refreshToken -verificationToken -passwordResetToken').sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      total: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

