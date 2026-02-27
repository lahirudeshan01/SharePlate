const express = require("express");
const router = express.Router();

// Import Donation Controller
const DonationController = require("../controllers/donationController");

//  Create Donation
router.post("/", DonationController.createDonation);

//  Get All Donations
router.get("/", DonationController.getAllDonations);

//  Get Single Donation by ID
router.get("/:id", DonationController.getDonationById);

//  Update Donation
router.put("/:id", DonationController.updateDonation);

//  Delete Donation
router.delete("/:id", DonationController.deleteDonation);

//  Reserve Donation
// router.patch("/:id/reserve", DonationController.reserveDonation);

// //  Mark as Collected
// router.patch("/:id/collect", DonationController.markAsCollected);

// Export Router
module.exports = router;
