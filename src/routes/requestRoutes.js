const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

//POSY - create a new request for a donation
router.post("/", requestController.createRequest);
//Approve a request and update donation status to approved
router.put(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("donor"),
  requestController.approveRequest
);
//Reject a request and make donation available again
router.put("/:id/reject", requestController.rejectRequest);
//Get all requests for a specific donation
router.get("/donation/:donationId", requestController.getRequestsByDonation);

module.exports = router;