const staticTwitchService = require("../services/staticTwitchService");

const getMinecraftStreams = (req, res) => {
    res.json(staticTwitchService.getMinecraftStreams());
};

const getFortniteStreams = (req, res) => {
    res.json(staticTwitchService.getFortniteStreams());
};

const getChatStreams = (req, res) => {
    res.json(staticTwitchService.getChatStreams());
};

const getFallGuysStreams = (req, res) => {
    res.json(staticTwitchService.getFallGuysStreams());
};

module.exports = {
    getMinecraftStreams,
    getFortniteStreams,
    getChatStreams,
    getFallGuysStreams,
};
