const express = require("express");
const twitchController = require("../controllers/twitchController");

const router = express.Router();

router.get("/topgames", twitchController.getTopGames);
router.get("/channels", twitchController.getLiveChannels);
router.get("/streams/user/:id", twitchController.getUserVideos);
router.get("/streams/:id", twitchController.getStreamsByGame);

module.exports = router;
