const express = require("express");
const twitchController = require("../controllers/twitchController");

const router = express.Router();

router.get("/", twitchController.getTopStreamsPage);

module.exports = router;
