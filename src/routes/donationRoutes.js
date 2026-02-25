const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new donation (Donor only)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodName
 *               - quantity
 *               - expiryDate
 *             properties:
 *               foodName:
 *                 type: string
 *               quantity:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       201:
 *         description: Donation created successfully
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("donor"),
  [
    body("foodName").notEmpty().withMessage("Food name is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive number"),
    body("expiryDate")
      .notEmpty()
      .withMessage("Expiry date is required")
      .isISO8601()
      .withMessage("Invalid date format"),
    validate
  ],
  donationController.createDonation
);

/**
 * @swagger
 * /api/donations/available:
 *   get:
 *     summary: Get all available donations
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: List of available donations
 */
router.get("/available", donationController.getAvailableDonations);

/**
 * @swagger
 * /api/donations/my-donations:
 *   get:
 *     summary: Get all donations by the logged-in donor
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of donor's donations
 */
router.get(
  "/my-donations",
  authMiddleware,
  authorizeRoles("donor"),
  donationController.getMyDonations
);

/**
 * @swagger
 * /api/donations/{id}:
 *   get:
 *     summary: Get a single donation by ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation details
 */
router.get("/:id", donationController.getDonationById);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all donations
 */
router.get(
  "/",
  authMiddleware,
  donationController.getAllDonations
);

module.exports = router;