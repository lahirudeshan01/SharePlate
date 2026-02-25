const Pickup = require("../models/Pickup");
const Request = require("../models/Request");


// Schedule Pickup
exports.schedulePickup = async (req, res) => {
  try {
    const { requestId, scheduledTime, notes } = req.body;

    // Check if request exists and is approved
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "approved") {
      return res.status(400).json({ message: "Request is not approved" });
    }

    const pickup = await Pickup.create({
      request: requestId,
      scheduledTime,
      notes
    });

    res.status(201).json(pickup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completePickup = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate({
        path: "request",
        populate: { path: "donation" }
      });

    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.status = "completed";
    await pickup.save();

    // Also update donation status
    if (pickup.request && pickup.request.donation) {
      pickup.request.donation.status = "completed";
      await pickup.request.donation.save();
    }

    res.status(200).json({ message: "Pickup completed", pickup });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//prevent multiple pickups for same request:
const existingPickup = await Pickup.findOne({ request: requestId });

if (existingPickup) {
  return res.status(400).json({ message: "Pickup already scheduled" });
}