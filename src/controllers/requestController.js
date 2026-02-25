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

//Reject a request and make donation available again
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

// View all requests for a specific donation
exports.getRequestsByDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const requests = await Request.find({ donation: donationId })
      .populate("shelter", "name email")
      .populate("donation", "foodName quantity status");

    if (!requests.length) {
      return res.status(404).json({ message: "No requests found for this donation" });
    }

    res.status(200).json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Approve a request and auto-reject others for the same donation
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Approve the request
    request.status = "approved";
    await request.save();

    // Also approve the related donation
    const donation = await Donation.findById(request.donation);
    donation.status = "approved";
    await donation.save();

    // Auto reject other pending requests for the same donation
    await Request.updateMany(
      {
        donation: request.donation,
        _id: { $ne: request._id }, // exclude current request
        status: "pending"         // reject only pending requests
      },
      {
        status: "rejected"
      }
    );

    res.status(200).json({ message: "Request approved and others rejected" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};