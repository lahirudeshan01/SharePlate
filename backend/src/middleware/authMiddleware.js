const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { errorResponse } = require('../utils/responseHandler');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, 'Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check if user is active
    if (!req.user.isActive) {
      return errorResponse(res, 'Your account has been deactivated', 403);
    }

    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized to access this route', 401);
  }
};
