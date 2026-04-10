const express = require("express");
const router = express.Router();
const pickupController = require("../controllers/pickupController");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/pickups:
 *   post:
 *     summary: Schedule a pickup for an approved request (Donor only)
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [requestId, scheduledTime]
 *             properties:
 *               requestId:
 *                 type: string
 *                 example: 64abc789
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T10:00:00Z"
 *               notes:
 *                 type: string
 *                 example: Call before arriving
 *     responses:
 *       201:
 *         description: Pickup scheduled successfully
 *       400:
 *         description: Request not approved or pickup already exists
 *       404:
 *         description: Request not found
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("donor"),
  pickupController.schedulePickup
);

/**
 * @swagger
 * /api/pickups/{id}/complete:
 *   put:
 *     summary: Mark a pickup as completed (Donor only)
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pickup ID
 *     responses:
 *       200:
 *         description: Pickup completed, donation marked as completed
 *       404:
 *         description: Pickup not found
 */
router.put(
  "/:id/complete",
  authMiddleware,
  authorizeRoles("donor"),
  pickupController.completePickup
);

/**
 * @swagger
 * /api/pickups/{id}/cancel:
 *   put:
 *     summary: Cancel a pickup and record an issue message (Donor only)
 *     tags: [Pickups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pickup ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issueMessage:
 *                 type: string
 *                 example: Driver unavailable, please reschedule
 *     responses:
 *       200:
 *         description: Pickup cancelled, issue recorded on request
 *       400:
 *         description: Cannot cancel a completed pickup
 *       404:
 *         description: Pickup not found
 */
router.put(
  "/:id/cancel",
  authMiddleware,
  authorizeRoles("donor"),
  pickupController.cancelPickup
);

module.exports = router;

module.exports = router;
