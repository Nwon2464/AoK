const twitchV2Service = require("../services/twitchV2Service");
const { createHttpError } = require("../utils/httpError");

const parseLimit = (value, defaultValue) => {
    if (value === undefined) {
        return defaultValue;
    }

    if (Array.isArray(value) || !/^\d+$/.test(value)) {
        throw createHttpError(400, "limit must be an integer from 1 to 100", "INVALID_LIMIT");
    }

    const limit = Number(value);
    if (limit < 1 || limit > 100) {
        throw createHttpError(400, "limit must be an integer from 1 to 100", "INVALID_LIMIT");
    }

    return limit;
};

const parseCursor = (value) => {
    if (value === undefined || value === "") {
        return undefined;
    }

    if (Array.isArray(value) || typeof value !== "string" || value.length > 500) {
        throw createHttpError(400, "cursor is invalid", "INVALID_CURSOR");
    }

    return value;
};

const parseGameId = (value) => {
    if (!/^\d+$/.test(value)) {
        throw createHttpError(400, "gameId must contain only numbers", "INVALID_GAME_ID");
    }

    return value;
};

const parseUserLogin = (value) => {
    if (!/^[a-zA-Z0-9_]{1,25}$/.test(value)) {
        throw createHttpError(400, "userLogin is invalid", "INVALID_USER_LOGIN");
    }

    return value.toLowerCase();
};

const parseSearchQuery = (value) => {
    if (Array.isArray(value) || typeof value !== "string") {
        throw createHttpError(400, "query is required", "INVALID_SEARCH_QUERY");
    }

    const query = value.trim();
    if (!query || query.length > 100) {
        throw createHttpError(
            400,
            "query must contain between 1 and 100 characters",
            "INVALID_SEARCH_QUERY"
        );
    }

    return query;
};

const getHome = async (req, res, next) => {
    try {
        res.json(await twitchV2Service.getHome());
    } catch (error) {
        next(error);
    }
};

const getStreams = async (req, res, next) => {
    try {
        const result = await twitchV2Service.getStreams({
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 8),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const result = await twitchV2Service.getCategories({
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 20),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getCategoryStreams = async (req, res, next) => {
    try {
        const result = await twitchV2Service.getCategoryStreams({
            gameId: parseGameId(req.params.gameId),
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 20),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getChannel = async (req, res, next) => {
    try {
        const result = await twitchV2Service.getChannel({
            userLogin: parseUserLogin(req.params.userLogin),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getChannelVideos = async (req, res, next) => {
    try {
        const result = await twitchV2Service.getChannelVideos({
            userLogin: parseUserLogin(req.params.userLogin),
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 12),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const searchChannels = async (req, res, next) => {
    try {
        const result = await twitchV2Service.searchChannels({
            query: parseSearchQuery(req.query.query),
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 10),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const searchCategories = async (req, res, next) => {
    try {
        const result = await twitchV2Service.searchCategories({
            query: parseSearchQuery(req.query.query),
            cursor: parseCursor(req.query.cursor),
            limit: parseLimit(req.query.limit, 10),
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategoryStreams,
    getChannel,
    getChannelVideos,
    getHome,
    getStreams,
    parseCursor,
    parseGameId,
    parseLimit,
    parseSearchQuery,
    parseUserLogin,
    searchCategories,
    searchChannels,
};
