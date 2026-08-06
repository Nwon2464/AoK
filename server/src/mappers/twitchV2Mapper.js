const replaceImageSize = (url, width, height) => String(url || "")
    .replace(/%?\{width\}/g, String(width))
    .replace(/%?\{height\}/g, String(height));

const toGameDto = (game) => ({
    id: game.id,
    name: game.name,
    boxArtUrl: replaceImageSize(game.box_art_url, 285, 385),
});

const toStreamDto = (stream, user) => ({
    id: stream.id,
    user: {
        id: stream.user_id,
        login: stream.user_login,
        displayName: stream.user_name,
        profileImageUrl: user?.profile_image_url || null,
    },
    game: {
        id: stream.game_id || null,
        name: stream.game_name || null,
    },
    title: stream.title,
    type: stream.type,
    viewerCount: stream.viewer_count,
    tags: stream.tags || [],
    startedAt: stream.started_at,
    language: stream.language,
    thumbnailUrl: replaceImageSize(stream.thumbnail_url, 440, 248),
    isMature: Boolean(stream.is_mature),
});

const createUserMap = (users) => users.reduce((map, user) => {
    map[user.id] = user;
    return map;
}, {});

const toStreamList = (streams, users) => {
    const userMap = createUserMap(users);
    return streams.map((stream) => toStreamDto(stream, userMap[stream.user_id]));
};

const toHomeDto = ({
    liveStreams,
    liveStreamsNextCursor,
    topGames,
    topGamesNextCursor,
    popularCategories,
    users,
}) => ({
    liveChannels: toStreamList(liveStreams, users),
    liveChannelsPagination: { nextCursor: liveStreamsNextCursor || null },
    topGames: topGames.map(toGameDto),
    topGamesPagination: { nextCursor: topGamesNextCursor || null },
    popularCategories: popularCategories.map(({ game, streams, nextCursor }) => ({
        game: toGameDto(game),
        streams: toStreamList(streams, users),
        pagination: { nextCursor: nextCursor || null },
    })),
});

const toChannelDto = ({ user, channel, liveStream }) => ({
    user: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        description: user.description,
        profileImageUrl: user.profile_image_url,
        offlineImageUrl: user.offline_image_url,
        broadcasterType: user.broadcaster_type,
        createdAt: user.created_at,
    },
    channel: channel
        ? {
            title: channel.title,
            language: channel.broadcaster_language,
            game: {
                id: channel.game_id || null,
                name: channel.game_name || null,
            },
            tags: channel.tags || [],
            contentClassificationLabels: channel.content_classification_labels || [],
            isBrandedContent: Boolean(channel.is_branded_content),
        }
        : null,
    liveStream: liveStream ? toStreamDto(liveStream, user) : null,
});

const toVideoDto = (video) => ({
    id: video.id,
    streamId: video.stream_id || null,
    user: {
        id: video.user_id,
        login: video.user_login,
        displayName: video.user_name,
    },
    title: video.title,
    description: video.description,
    createdAt: video.created_at,
    publishedAt: video.published_at,
    url: video.url,
    thumbnailUrl: replaceImageSize(video.thumbnail_url, 440, 248),
    viewCount: video.view_count,
    language: video.language,
    type: video.type,
    duration: video.duration,
});

const toSearchChannelDto = (channel) => ({
    id: channel.id,
    login: channel.broadcaster_login,
    displayName: channel.display_name,
    language: channel.broadcaster_language,
    game: {
        id: channel.game_id || null,
        name: channel.game_name || null,
    },
    isLive: Boolean(channel.is_live),
    tags: channel.tags || [],
    thumbnailUrl: channel.thumbnail_url || null,
    title: channel.title || "",
    startedAt: channel.started_at || null,
});

module.exports = {
    replaceImageSize,
    toChannelDto,
    toGameDto,
    toHomeDto,
    toSearchChannelDto,
    toStreamList,
    toVideoDto,
};
