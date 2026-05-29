const express = require("express");
const twitchController = require("../controllers/twitchController");

const router = express.Router();

router.get("/:user_id", twitchController.getVideosByUser);

module.exports = router;
