const express = require('express');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} = require('../validations/authValidations');

const router = express.Router();

router.post('/register', validationMiddleware(registerSchema), authController.register);
router.post('/login', validationMiddleware(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/verify-email', authController.verifyEmail);

router.post('/forgot-password', validationMiddleware(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validationMiddleware(resetPasswordSchema), authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', protect, authController.getProfile);
router.put('/me', protect, upload.single('profilePhoto'), authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

// Admin-only routes
router.get('/admin/users', protect, restrictTo('admin'), authController.adminGetAllUsers);

module.exports = router;

