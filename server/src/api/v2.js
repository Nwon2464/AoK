const express = require("express");

const twitchV2Routes = require("../routes/twitchV2Routes");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        name: "AoK Twitch API",
        version: "2",
    });
});

router.use(twitchV2Routes);

module.exports = router;
