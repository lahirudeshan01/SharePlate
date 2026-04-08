const Donation = require("../models/DonationModel");

// Create Donation (restaurant only)
const createDonation = async (req, res) => {
  try {
    const { foodName, description, quantity, pickupAddress, expiryDate } = req.body;
    const donation = await Donation.create({
      foodName,
      description,
      quantity,
      pickupAddress,
      expiryDate,
      donor: req.user._id,
    });
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

// Get All Donations with search & filter
const getAllDonations = async (req, res) => {
  try {
    const filter = {};

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search by food name (case-insensitive partial match)
    if (req.query.search) {
      filter.foodName = { $regex: req.query.search, $options: "i" };
    }

    const donations = await Donation.find(filter)
      .populate("donor", "name organizationName phone address")
      .populate("reservedBy", "name organizationName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: donations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get my donations (for the logged-in restaurant user)
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("donor", "name organizationName phone address")
      .populate("reservedBy", "name organizationName")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: donations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Donation
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name organizationName phone address")
      .populate("reservedBy", "name organizationName");

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    res.status(200).json({ success: true, data: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Donation (Donor Only — can only update their own)
const updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    // Only the donor who created it (or admin) can update
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this donation" });
    }

    const { foodName, description, quantity, pickupAddress, expiryDate, status } = req.body;
    donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { foodName, description, quantity, pickupAddress, expiryDate, status },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Donation (Donor Only — can only delete their own)
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this donation" });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reserve Donation (shelter only)
const reserveDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    if (donation.status !== "available") {
      return res.status(400).json({ success: false, message: "Donation is not available for reservation" });
    }

    donation.status = "reserved";
    donation.reservedBy = req.user._id;
    donation.reservedAt = new Date();
    await donation.save();

    // Return populated data so frontend can display properly
    const populated = await Donation.findById(donation._id)
      .populate("donor", "name organizationName phone address")
      .populate("reservedBy", "name organizationName");

    res.status(200).json({
      success: true,
      message: "Donation reserved successfully",
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mark Donation as Collected (donor or the shelter that reserved it)
const markCollected = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    if (donation.status !== "reserved") {
      return res.status(400).json({ success: false, message: "Only reserved donations can be marked as collected" });
    }

    // Allow the donor, the shelter that reserved, or admin
    const isDonor = donation.donor.toString() === req.user._id.toString();
    const isReserver = donation.reservedBy && donation.reservedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isDonor && !isReserver && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    donation.status = "collected";
    await donation.save();

    const populated = await Donation.findById(donation._id)
      .populate("donor", "name organizationName phone address")
      .populate("reservedBy", "name organizationName");

    res.status(200).json({
      success: true,
      message: "Donation marked as collected",
      data: populated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createDonation = createDonation;
exports.getAllDonations = getAllDonations;
exports.getMyDonations = getMyDonations;
exports.getDonationById = getDonationById;
exports.updateDonation = updateDonation;
exports.deleteDonation = deleteDonation;
exports.reserveDonation = reserveDonation;
exports.markCollected = markCollected;