const express = require("express");

const twitchV2Controller = require("../controllers/twitchV2Controller");

const router = express.Router();

router.get("/home", twitchV2Controller.getHome);
router.get("/streams", twitchV2Controller.getStreams);
router.get("/categories", twitchV2Controller.getCategories);
router.get("/categories/:gameId/streams", twitchV2Controller.getCategoryStreams);
router.get("/search/channels", twitchV2Controller.searchChannels);
router.get("/search/categories", twitchV2Controller.searchCategories);
router.get("/channels/:userLogin/videos", twitchV2Controller.getChannelVideos);
router.get("/channels/:userLogin", twitchV2Controller.getChannel);

module.exports = router;
