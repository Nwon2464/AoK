const twitchClient = require("../clients/twitchClient");
const replaceThumbnailSize = require("../utils");

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

const withBoxArtSize = (game, width = 285, height = 385) => ({
    ...game,
    box_art_url: replaceThumbnailSize(game.box_art_url, width, height),
});

const withStreamThumbnailSize = (stream, width = 440, height = 248) => ({
    ...stream,
    thumbnail_url: replaceThumbnailSize(stream.thumbnail_url, width, height),
});

const getTopGames = async () => {
    const topGames = await twitchClient.getTopGames();
    return topGames.data;
};

const getAllCategories = async () => {
    const topGames = await twitchClient.getTopGames({ first: 50 });
    return topGames.data.map((game) => withBoxArtSize(game));
};

const getVideosByUser = async ({ userId, cursor }) => {
    return twitchClient.getVideosByUser(userId, {
        first: 12,
        after: cursor,
    });
};

const getLiveChannels = async () => {
    const streamsResponse = await twitchClient.getStreams({
        first: 8,
        type: "live",
    });
    const userMap = await getUserMap(streamsResponse.data);

    return {
        ...streamsResponse,
        data: streamsResponse.data.map((stream) => ({
            ...stream,
            profile_image_url: userMap[stream.user_id]?.profile_image_url,
        })),
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
        data: streamsResponse.data.map((stream) => ({
            ...stream,
            profile_url: userMap[stream.user_id]?.profile_image_url,
        })),
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

            return {
                ...withStreamThumbnailSize(stream),
                ...(user
                    ? {
                        profile_image_url: replaceThumbnailSize(user.profile_image_url, 300, 300),
                        description: user.description,
                    }
                    : {}),
            };
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
    const videos = await twitchClient.getVideosByUser(userId, { first: 50 });
    return { streams: videos.data };
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
