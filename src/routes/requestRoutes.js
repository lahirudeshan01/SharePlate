const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.post("/", requestController.createRequest);
router.put("/:id/approve", requestController.approveRequest);
router.put("/:id/reject", requestController.rejectRequest);

module.exports = router;