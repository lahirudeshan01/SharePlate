const Donation = require("../models/DonationModel");

// Create Donation
const createDonation = async (req, res) => {
  let donation;
  try {
    donation = await Donation.create(req.body);
    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Available Donations by Id
const getAllDonations = async (req, res) => {
  let donations;
  try {
    donations = await Donation.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!donations) {
    return res.status(404).json({ massage: "Donation not found" });
  }
  //Display all Donation
  return res.status(200).json({ donations });
};

//  Get Single Donation
const getDonationById = async (req, res) => {
  const id = req.params.id;
  let donation;
  try {
    donation = await Donation.findById(id);
 
    //not available donations
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Donation (Donor Only)
 const updateDonation = async (req, res) => {
    const id = req.params.id;
    let donation;
  try {
     donation = await Donation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Donation
const deleteDonation = async (req, res) => {
  const id = req.params.id;
  try {
    await Donation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createDonation = createDonation;
exports.getAllDonations = getAllDonations;
exports.getDonationById = getDonationById;
exports.updateDonation = updateDonation;
exports.deleteDonation = deleteDonation;