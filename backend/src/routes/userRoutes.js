const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateUpdateProfile } = require('../validators/userValidator');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// User profile management (accessible by all authenticated users)
router.put('/profile', validateUpdateProfile, updateProfile);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/role/:role', authorize('admin'), getUsersByRole);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
