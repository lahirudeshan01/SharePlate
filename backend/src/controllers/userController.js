const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    successResponse(res, {
      count: users.length,
      users
    }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      organizationName: req.body.organizationName
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user by ID (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive,
      isVerified: req.body.isVerified,
      phone: req.body.phone,
      address: req.body.address,
      organizationName: req.body.organizationName
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    await user.deleteOne();

    successResponse(res, {}, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
exports.getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    if (!['restaurant', 'shelter', 'admin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    const users = await User.find({ role }).select('-password');

    successResponse(res, {
      count: users.length,
      users
    }, `${role} users retrieved successfully`);
  } catch (error) {
    next(error);
  }
};
