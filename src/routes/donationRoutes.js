const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

//POST - create donations
router.post(
  "/",
  [
    body("foodName").notEmpty().withMessage("Food name is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be positive number"),
    validate
  ],
  donationController.createDonation
);

//GET -  available donations
router.get("/", donationController.getAvailableDonations);

module.exports = router;