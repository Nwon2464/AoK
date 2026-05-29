const express = require("express");
const staticTwitchController = require("../controllers/staticTwitchController");

const router = express.Router();

router.get("/minecraft", staticTwitchController.getMinecraftStreams);
router.get("/fortnite", staticTwitchController.getFortniteStreams);
router.get("/chat", staticTwitchController.getChatStreams);
router.get("/fallguys", staticTwitchController.getFallGuysStreams);

module.exports = router;
