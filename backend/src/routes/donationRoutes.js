const express = require("express");
const router = express.Router();

const DonationController = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ─── Public routes ───────────────────────────────────────────────────────────
router.get("/", DonationController.getAllDonations);

// ─── All routes below require authentication ─────────────────────────────────
router.use(protect);

// My donations (static path — MUST be above /:id)
router.get("/my-donations", authorize("restaurant", "admin"), DonationController.getMyDonations);

// Single donation detail (authenticated)
router.get("/:id", DonationController.getDonationById);

// Restaurant: create, update, delete
router.post("/", authorize("restaurant", "admin"), DonationController.createDonation);
router.put("/:id", authorize("restaurant", "admin"), DonationController.updateDonation);
router.delete("/:id", authorize("restaurant", "admin"), DonationController.deleteDonation);

// Shelter: reserve a donation
router.put("/:id/reserve", authorize("shelter"), DonationController.reserveDonation);

// Donor or Shelter: mark donation as collected
router.put("/:id/collect", authorize("restaurant", "shelter", "admin"), DonationController.markCollected);

module.exports = router;
