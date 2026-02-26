const Donation = require("../models/DonationModel");

// ✅ Create Donation
exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Get All Available Donations
const getAllDonations = async (req, res) => {
    let Donations;
  try {
    donations = await Donation.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if(!donations){
    return res.status(404).json({massage:"Donation not found"});
  }
  //Display all Donation
  return res.status(200).json({donations});
};

exports.getAllDonations = getAllDonations;  

// ✅ Get Single Donation
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Update Donation (Donor Only)
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Delete Donation
exports.deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Donation deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Reserve Donation (Shelter)
exports.reserveDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        status: "Reserved",
        reservedBy: req.body.shelterId
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Donation reserved",
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Mark as Collected
exports.markAsCollected = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: "Collected" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Donation marked as collected",
      data: donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ✅ Auto Expire Donations
exports.expireDonations = async () => {
  const now = new Date();

  await Donation.updateMany(
    {
      expiryTime: { $lt: now },
      status: "Available"
    },
    { status: "Expired" }
  );
};