const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new request for a donation (Shelter only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - donationId
 *             properties:
 *               donationId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 */
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
    body("message")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Message must be less than 500 characters"),
    validate
  ],
  requestController.createRequest
);

/**
 * @swagger
 * /api/requests/{id}/approve:
 *   put:
 *     summary: Approve a request (Donor only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request approved successfully
 */
router.put(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.approveRequest
);

/**
 * @swagger
 * /api/requests/{id}/reject:
 *   put:
 *     summary: Reject a request (Donor only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request rejected successfully
 */
router.put(
  "/:id/reject",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.rejectRequest
);

/**
 * @swagger
 * /api/requests/my-requests:
 *   get:
 *     summary: Get all requests made by the logged-in shelter
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 */
router.get(
  "/my-requests",
  authMiddleware,
  authorizeRoles("shelter"),
  requestController.getMyRequests
);

/**
 * @swagger
 * /api/requests/my-donations:
 *   get:
 *     summary: Get all requests for the logged-in donor's donations
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests for donor's donations
 */
router.get(
  "/my-donations",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.getRequestsForMyDonations
);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all requests (All authenticated users)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all requests
 */
router.get(
  "/",
  authMiddleware,
  requestController.getAllRequests
);

/**
 * @swagger
 * /api/requests/donation/{donationId}:
 *   get:
 *     summary: Get all requests for a specific donation
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: donationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of requests for the donation
 */
router.get(
  "/donation/:donationId",
  authMiddleware,
  requestController.getRequestsByDonation
);

module.exports = router;