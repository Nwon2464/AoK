const mockTwitchService = require("../services/mockTwitchService");

const getFrontPageStreams = (req, res) => {
    res.json(mockTwitchService.getFrontPageStreams());
};

const getGroupedFrontPageStreams = (req, res) => {
    res.json(mockTwitchService.getGroupedFrontPageStreams());
};

module.exports = {
    getFrontPageStreams,
    getGroupedFrontPageStreams,
};
