const Request = require("../models/Request");
const Donation = require("../models/Donation");

exports.createRequest = async (req, res) => {
  try {
    const { donationId, shelterId, status,message} = req.body;

    const donation = await Donation.findById(donationId);

    if (!donation || donation.status !== "available") {
      return res.status(400).json({ message: "Donation not available" });
    }

    const request = await Request.create({
      donation: donationId,
      shelter: shelterId,
      status: status,
      message: message
    });

    donation.status = "requested";
    await donation.save();

    res.status(201).json(request);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    await request.save();

    // update donation status
    request.donation.status = "approved";
    await request.donation.save();

    res.status(200).json({ message: "Request approved", request });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("donation");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    // donation becomes available again
    request.donation.status = "available";
    await request.donation.save();

    res.status(200).json({ message: "Request rejected", request });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};