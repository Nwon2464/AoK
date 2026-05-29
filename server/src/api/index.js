require('dotenv').config();
const express = require('express');
const emojis = require('./emojis');
const router = express.Router();

const legacyTwitchRoutes = require("../routes/legacyTwitchRoutes");
const staticTwitchRoutes = require("../routes/staticTwitchRoutes");
const twitchRoutes = require("../routes/twitchRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const videoRoutes = require("../routes/videoRoutes");
const topStreamsRoutes = require("../routes/topStreamsRoutes");

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use("/categories", categoryRoutes);
router.use("/videos", videoRoutes);
router.get("/twitch/streams/contents", async (req, res) => {
  res.send("not being used currently");
});
router.use("/twitch", legacyTwitchRoutes);
router.use("/twitch", staticTwitchRoutes);
router.use("/twitch", twitchRoutes);
router.use("/tstreams", topStreamsRoutes);

router.use('/emojis', emojis);

module.exports = router;
