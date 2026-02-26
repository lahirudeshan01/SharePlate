const express = require("express");
const router = express.Router();
//Insert Model
const Donation = require("../models/DonationModel")
//Insert  Donation Controller
const DonationController = require("../controllers/donationController"); 

router.get("/",DonationController.getAllDonations);

//export
module.exports = router;
