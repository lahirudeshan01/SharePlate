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
