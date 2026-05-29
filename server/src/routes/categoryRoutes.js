const express = require("express");
const twitchController = require("../controllers/twitchController");

const router = express.Router();

router.get("/all", twitchController.getAllCategories);

module.exports = router;
