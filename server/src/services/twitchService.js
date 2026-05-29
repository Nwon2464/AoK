const twitchClient = require("../clients/twitchClient");
const { getCache, setCache } = require("../utils/cache");
const {
    withBoxArtSize,
    withProfileImage,
    withTopStreamerInfo,
} = require("../mappers/twitchMapper");

const CACHE_TTL = {
    TOP_GAMES: 5 * 60 * 1000,
    CATEGORIES: 5 * 60 * 1000,
    USER_VIDEOS: 5 * 60 * 1000,
};

const CATEGORY_STREAMS = {
    "Just Chatting": "509658",
    Fortnite: "33214",
    "Fall Guys": "512980",
    Minecraft: "27471",
};

const getUserMap = async (streams) => {
    const userIds = [...new Set(streams.map((stream) => stream.user_id).filter(Boolean))];
    const users = await twitchClient.getUsersByIds(userIds);

    return users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});
};

const getTopGames = async () => {
    const cacheKey = "twitch:topgames";
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const topGames = await twitchClient.getTopGames();
    const result = topGames.data;

    setCache(cacheKey, result, CACHE_TTL.TOP_GAMES);

    return result;
};

const getAllCategories = async () => {
    const cacheKey = "twitch:categories:all";
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const topGames = await twitchClient.getTopGames({ first: 50 });
    const result = topGames.data.map((game) => withBoxArtSize(game));

    setCache(cacheKey, result, CACHE_TTL.CATEGORIES);

    return result;
};

const getVideosByUser = async ({ userId, cursor }) => {
    const cacheKey = `twitch:videos:user:${userId}:cursor:${cursor || "first"}`;
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const result = await twitchClient.getVideosByUser(userId, {
        first: 12,
        after: cursor,
    });

    setCache(cacheKey, result, CACHE_TTL.USER_VIDEOS);

    return result;
};

const getLiveChannels = async () => {
    const streamsResponse = await twitchClient.getStreams({
        first: 8,
        type: "live",
    });
    const userMap = await getUserMap(streamsResponse.data);

    return {
        ...streamsResponse,
        data: streamsResponse.data.map((stream) => (
            withProfileImage(stream, userMap[stream.user_id])
        )),
    };
};

const getStreamsByGame = async ({ gameId, cursor }) => {
    const streamsResponse = await twitchClient.getStreams({
        gameId,
        first: 12,
        after: cursor,
    });
    const userMap = await getUserMap(streamsResponse.data);

    return {
        ...streamsResponse,
        data: streamsResponse.data.map((stream) => (
            withProfileImage(stream, userMap[stream.user_id], "profile_url")
        )),
    };
};

const getTopStreamsPage = async () => {
    const topGames = await twitchClient.getTopGames({ first: 8 });
    const data = {
        topGames: {},
        categories: {},
    };

    for (const game of topGames.data) {
        const streamsResponse = await twitchClient.getStreams({
            gameId: game.id,
            first: 2,
        });
        const userMap = await getUserMap(streamsResponse.data);

        data.topGames[game.name] = streamsResponse.data.map((stream) => {
            const user = userMap[stream.user_id];
            return withTopStreamerInfo(stream, user);
        });
    }

    for (const [category, gameId] of Object.entries(CATEGORY_STREAMS)) {
        const streamsResponse = await twitchClient.getStreams({
            gameId,
            first: 5,
        });
        data.categories[category] = streamsResponse.data;
    }

    return data;
};

const getUserVideos = async (userId) => {
    const cacheKey = `twitch:user-videos:${userId}`;
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const videos = await twitchClient.getVideosByUser(userId, { first: 50 });
    const result = { streams: videos.data };

    setCache(cacheKey, result, CACHE_TTL.USER_VIDEOS);

    return result;
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
