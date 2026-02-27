const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

// Create a new request for a donation (Shelter only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("shelter"),
  [
    body("donationId")
      .notEmpty()
      .withMessage("Donation ID is required")
      .isMongoId()
      .withMessage("Invalid donation ID"),
    body("requestedQuantity")
      .notEmpty()
      .withMessage("Requested quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("foodName")
      .notEmpty()
      .withMessage("Food name is required")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Food name must be between 2 and 100 characters"),
    body("message")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Message must be less than 500 characters"),
    validate
  ],
  requestController.createRequest
);

// Approve a request (Donor only)
router.put(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.approveRequest
);

// Reject a request (Donor only)
router.put(
  "/:id/reject",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.rejectRequest
);

// Update a pending request (Shelter only - own requests)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("shelter"),
  [
    body("requestedQuantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("foodName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Food name must be between 2 and 100 characters"),
    body("message")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Message must be less than 500 characters"),
    validate
  ],
  requestController.updateRequest
);

// Delete a pending request (Shelter only - own requests)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("shelter"),
  requestController.deleteRequest
);

// Get all requests made by the logged-in shelter
router.get(
  "/my-requests",
  authMiddleware,
  authorizeRoles("shelter"),
  requestController.getMyRequests
);

// Get approved requests with pickup information (Shelter only - for table display)
router.get(
  "/my-approved-requests",
  authMiddleware,
  authorizeRoles("shelter"),
  requestController.getMyApprovedRequests
);

// Get all requests for the logged-in donor's donations
router.get(
  "/my-donations",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.getRequestsForMyDonations
);

// Get all requests (All authenticated users)
router.get(
  "/",
  authMiddleware,
  requestController.getAllRequests
);

// Get all requests for a specific donation
router.get(
  "/donation/:donationId",
  authMiddleware,
  requestController.getRequestsByDonation
);

module.exports = router;