const User = require('../models/User');
const crypto = require('crypto');
const { sendTokenResponse } = require('../utils/tokenUtils');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const emailService = require('../services/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, organizationName, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      organizationName,
      address
    });

    // Send welcome email (Third-party API integration)
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (error) {
      console.error('Failed to send welcome email:', error.message);
      // Don't fail registration if email fails
    }

    sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return errorResponse(res, 'Please provide an email and password', 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Please contact admin.', 403);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    successResponse(res, user, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Please provide current and new password', 400);
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    // Send password change confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user);
    } catch (error) {
      console.error('Failed to send password change email:', error.message);
    }

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    successResponse(res, {}, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Please provide an email address', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 'No user found with this email address', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to user
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send password reset email (Third-party API integration)
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      
      successResponse(
        res,
        {},
        'Password reset email sent successfully. Please check your email.',
        200
      );
    } catch (error) {
      // Reset token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error('Email send error:', error);
      return errorResponse(
        res,
        'Email could not be sent. Please try again later.',
        500
      );
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 'Please provide a new password', 400);
    }

    // Validate password strength
    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return errorResponse(
        res,
        'Invalid or expired reset token. Please request a new password reset.',
        400
      );
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user);
    } catch (error) {
      console.error('Failed to send confirmation email:', error.message);
    }

    sendTokenResponse(user, 200, res, 'Password reset successful. You are now logged in.');
  } catch (error) {
    next(error);
  }
};
