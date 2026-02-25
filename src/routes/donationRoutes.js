const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

//POST - create donations
router.post("/", donationController.createDonation);

//GET -  available donations
router.get("/", donationController.getAvailableDonations);

module.exports = router;