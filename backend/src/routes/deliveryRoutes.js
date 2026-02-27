const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.get("/getalldelivery", deliveryController.getAllDeliveries);
router.post("/confirm", deliveryController.confirmDelivery);
router.put("/start/:deliveryId", deliveryController.startDelivery);
router.put("/complete/:deliveryId", deliveryController.completeDelivery);
router.delete("/cancel/:deliveryId", deliveryController.cancelDelivery);

module.exports = router;
