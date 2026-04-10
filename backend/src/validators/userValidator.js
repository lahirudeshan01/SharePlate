const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Validation rules for user registration
exports.validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['restaurant', 'shelter', 'admin'])
    .withMessage('Role must be either restaurant, shelter, or admin'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('organizationName')
    .if(body('role').isIn(['restaurant', 'shelter']))
    .notEmpty()
    .withMessage('Organization name is required for restaurants and shelters'),
  
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim(),
  body('address.country').optional().trim(),
  body('preciseLocation')
    .not()
    .exists()
    .withMessage('Precise location can only be added from profile settings'),
  
  validate
];

// Validation rules for user login
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Validation rules for updating user profile
exports.validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('organizationName')
    .optional()
    .trim(),
  
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim(),
  body('address.country').optional().trim(),
  body('preciseLocation.latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid number between -90 and 90')
    .toFloat(),
  body('preciseLocation.longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid number between -180 and 180')
    .toFloat(),
  body('preciseLocation')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) {
        return true;
      }

      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Precise location must be an object with latitude and longitude');
      }

      const hasLatitude = Object.prototype.hasOwnProperty.call(value, 'latitude');
      const hasLongitude = Object.prototype.hasOwnProperty.call(value, 'longitude');

      if (hasLatitude !== hasLongitude) {
        throw new Error('Provide both latitude and longitude for precise location');
      }

      return true;
    }),
  
  validate
];

// Validation rules for updating password
exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  validate
];
