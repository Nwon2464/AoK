const twitchService = require("../services/twitchService");

const getTopGames = async (req, res, next) => {
    try {
        const topGames = await twitchService.getTopGames();
        res.json(topGames);
    } catch (error) {
        console.log("twitch topgames fetching error");
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await twitchService.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const getVideosByUser = async (req, res, next) => {
    try {
        const videos = await twitchService.getVideosByUser({
            userId: req.params.user_id,
            cursor: req.query.cursor,
        });
        res.json(videos);
    } catch (error) {
        next(error);
    }
};

const getLiveChannels = async (req, res, next) => {
    try {
        const channels = await twitchService.getLiveChannels();
        res.json(channels);
    } catch (error) {
        next(error);
    }
};

const getStreamsByGame = async (req, res, next) => {
    try {
        const streams = await twitchService.getStreamsByGame({
            gameId: req.params.id,
            cursor: req.query.cursor,
        });
        res.json(streams);
    } catch (error) {
        next(error);
    }
};

const getTopStreamsPage = async (req, res, next) => {
    try {
        const streamsPage = await twitchService.getTopStreamsPage();
        res.json(streamsPage);
    } catch (error) {
        next(error);
    }
};

const getUserVideos = async (req, res, next) => {
    try {
        const videos = await twitchService.getUserVideos(req.params.id);
        res.json(videos);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTopGames,
    getAllCategories,
    getVideosByUser,
    getLiveChannels,
    getStreamsByGame,
    getTopStreamsPage,
    getUserVideos,
};
