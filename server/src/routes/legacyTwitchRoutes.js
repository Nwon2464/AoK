const express = require("express");
const mockTwitchController = require("../controllers/mockTwitchController");

const router = express.Router();

router.get("/", mockTwitchController.getFrontPageStreams);
router.get("/streams", mockTwitchController.getGroupedFrontPageStreams);

module.exports = router;
