const Donation = require("../models/Donation");

//Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { foodName, quantity, expiryDate, location } = req.body;
    const donorId = req.user._id; // Get from authenticated user

    const donation = await Donation.create({
      foodName,
      quantity,
      donor: donorId,
      expiryDate,
      location,
      status: "available"
    });

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      donation
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get available donations
exports.getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" })
      .populate("donor", "name email organizationName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Public: get all donations
exports.getPublicDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email organizationName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all donations by the logged-in donor
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single donation by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email organizationName location");

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });
    }

    res.status(200).json({
      success: true,
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all donations (for admin or general view)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email organizationName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};