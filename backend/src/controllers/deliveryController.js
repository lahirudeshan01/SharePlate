const Delivery = require("../models/DeliveryModel");
const Request = require("../models/RequestModel");

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("request")
      .populate("deliveryMan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.confirmDelivery = async (req, res) => {
//   try {
//     const { requestId, deliverManId, deliveryDetails } = req.body;

//     const request = await Request.findById(requestId);
//     if (!request || request.status !== "APPROVED") {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     const delivery = await Delivery.create({
//       requestId,
//       deliverManId,
//       deliveryDetails,
//       status: "CONFIRMED",
//     });

//     request.status = "CONFIRMED";
//     await request.save();

//     res.status(201).json(delivery);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.confirmDelivery = async (req, res) => {
  try {
    const { requestId, deliverManId, deliveryDetails } = req.body;

    const request = await Request.findById(requestId);
    if (!request || request.status.toLowerCase() !== "approved") {
      return res.status(400).json({
        success: false,
        message:
          "Request must exist and be approved before confirming delivery",
      });
    }

    const delivery = await Delivery.create({
      requestId,
      deliverManId,
      deliveryDetails,
      status: "confirmed",
    });

    request.deliverStatus = "confirmed";
    await request.save();

    res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: "Not found" });

    delivery.status = "IN_PROGRESS";
    await delivery.save();

    await Request.findByIdAndUpdate(delivery.requestId, {
      status: "IN_PROGRESS",
    });

    res.json({ message: "Delivery started" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: "Not found" });

    delivery.status = "COMPLETED";
    await delivery.save();

    await Request.findByIdAndUpdate(delivery.requestId, {
      status: "COMPLETED",
    });

    res.json({ message: "Delivery completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: "Not found" });

    await Request.findByIdAndUpdate(delivery.requestId, {
      status: "CANCELLED",
    });

    await Delivery.findByIdAndDelete(deliveryId);

    res.json({ message: "Delivery cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
