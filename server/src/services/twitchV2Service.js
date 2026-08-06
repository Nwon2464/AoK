const twitchClient = require("../clients/twitchClient");
const {
    toChannelDto,
    toGameDto,
    toHomeDto,
    toSearchChannelDto,
    toStreamList,
    toVideoDto,
} = require("../mappers/twitchV2Mapper");
const { getCache, getOrSetCache } = require("../utils/cache");
const { createHttpError } = require("../utils/httpError");

const CACHE_TTL = {
    HOME: 30 * 1000,
    STREAMS: 30 * 1000,
    TOP_GAMES: 5 * 60 * 1000,
    USER: 30 * 60 * 1000,
    GAME: 60 * 60 * 1000,
    CHANNEL: 30 * 1000,
    VIDEOS: 2 * 60 * 1000,
    SEARCH_CHANNELS: 30 * 1000,
    SEARCH_CATEGORIES: 5 * 60 * 1000,
};

const HOME_CONFIG = {
    LIVE_CHANNELS: 8,
    TOP_GAMES: 15,
    POPULAR_CATEGORIES: 4,
    STREAMS_PER_CATEGORY: 4,
};

const nowIso = () => new Date().toISOString();

const withCache = async (key, ttlMs, loader) => {
    const cached = getCache(key);

    if (cached !== null) {
        return {
            ...cached,
            meta: { ...cached.meta, cached: true },
        };
    }

    const value = await getOrSetCache(key, ttlMs, loader);
    return {
        ...value,
        meta: { ...value.meta, cached: false },
    };
};

const toTwitchError = (error) => {
    if (error.statusCode) {
        return error;
    }

    return createHttpError(502, "Twitch API is temporarily unavailable", "TWITCH_API_ERROR");
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const getUsersForStreams = async (streams) => {
    const userIds = unique(streams.map((stream) => stream.user_id));
    return twitchClient.getUsersByIds(userIds.slice(0, 100));
};

const resolveUserByLogin = (userLogin) => withCache(
    `v2:twitch:user:login:${userLogin.toLowerCase()}`,
    CACHE_TTL.USER,
    async () => {
        const users = await twitchClient.getUsersByLogins([userLogin]);
        const user = users[0];

        if (!user) {
            throw createHttpError(404, "Twitch channel not found", "CHANNEL_NOT_FOUND");
        }

        return { data: user, meta: { generatedAt: nowIso() } };
    }
).then((response) => response.data);

const resolveGameById = (gameId) => withCache(
    `v2:twitch:game:${gameId}`,
    CACHE_TTL.GAME,
    async () => {
        const games = await twitchClient.getGamesByIds([gameId]);
        const game = games[0];

        if (!game) {
            throw createHttpError(404, "Twitch category not found", "CATEGORY_NOT_FOUND");
        }

        return { data: game, meta: { generatedAt: nowIso() } };
    }
).then((response) => response.data);

const loadHome = async () => {
    const errors = [];
    const [topGamesResult, liveStreamsResult] = await Promise.allSettled([
        twitchClient.getTopGames({ first: HOME_CONFIG.TOP_GAMES }),
        twitchClient.getStreams({
            first: HOME_CONFIG.LIVE_CHANNELS,
            type: "live",
        }),
    ]);

    if (topGamesResult.status === "rejected" && liveStreamsResult.status === "rejected") {
        throw createHttpError(502, "Unable to load Twitch home data", "TWITCH_HOME_UNAVAILABLE");
    }

    const topGames = topGamesResult.status === "fulfilled"
        ? topGamesResult.value.data
        : [];
    const topGamesNextCursor = topGamesResult.status === "fulfilled"
        ? topGamesResult.value.pagination?.cursor || null
        : null;
    const liveStreams = liveStreamsResult.status === "fulfilled"
        ? liveStreamsResult.value.data
        : [];
    const liveStreamsNextCursor = liveStreamsResult.status === "fulfilled"
        ? liveStreamsResult.value.pagination?.cursor || null
        : null;

    if (topGamesResult.status === "rejected") {
        errors.push({ section: "topGames", code: "TWITCH_API_ERROR" });
    }
    if (liveStreamsResult.status === "rejected") {
        errors.push({ section: "liveChannels", code: "TWITCH_API_ERROR" });
    }

    const popularGames = topGames.slice(0, HOME_CONFIG.POPULAR_CATEGORIES);
    const categoryResults = await Promise.allSettled(
        popularGames.map((game) => twitchClient.getStreams({
            gameId: game.id,
            first: HOME_CONFIG.STREAMS_PER_CATEGORY,
            type: "live",
        }))
    );

    const popularCategories = popularGames.map((game, index) => {
        const result = categoryResults[index];

        if (result.status === "rejected") {
            errors.push({
                section: `popularCategories.${game.id}`,
                code: "TWITCH_API_ERROR",
            });
            return { game, streams: [], nextCursor: null };
        }

        return {
            game,
            streams: result.value.data,
            nextCursor: result.value.pagination?.cursor || null,
        };
    });

    const allStreams = [
        ...liveStreams,
        ...popularCategories.flatMap((category) => category.streams),
    ];

    let users = [];
    try {
        users = await getUsersForStreams(allStreams);
    } catch (error) {
        errors.push({ section: "users", code: "TWITCH_API_ERROR" });
    }

    return {
        data: toHomeDto({
            liveStreams,
            liveStreamsNextCursor,
            topGames,
            topGamesNextCursor,
            popularCategories,
            users,
        }),
        ...(errors.length ? { errors } : {}),
        meta: {
            generatedAt: nowIso(),
            partial: errors.length > 0,
        },
    };
};

const getHome = () => withCache("v2:twitch:home", CACHE_TTL.HOME, loadHome);

const getStreams = async ({ cursor, limit }) => {
    const key = `v2:twitch:streams:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.STREAMS, async () => {
            const response = await twitchClient.getStreams({
                first: limit,
                after: cursor,
                type: "live",
            });
            const users = await getUsersForStreams(response.data);

            return {
                data: toStreamList(response.data, users),
                pagination: { nextCursor: response.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const getCategories = async ({ cursor, limit }) => {
    const key = `v2:twitch:categories:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.TOP_GAMES, async () => {
            const response = await twitchClient.getTopGames({ first: limit, after: cursor });
            return {
                data: response.data.map(toGameDto),
                pagination: { nextCursor: response.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const getCategoryStreams = async ({ gameId, cursor, limit }) => {
    const key = `v2:twitch:category:${gameId}:streams:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.STREAMS, async () => {
            const [game, streamsResponse] = await Promise.all([
                resolveGameById(gameId),
                twitchClient.getStreams({ gameId, first: limit, after: cursor, type: "live" }),
            ]);

            const users = await getUsersForStreams(streamsResponse.data);
            return {
                data: {
                    category: toGameDto(game),
                    streams: toStreamList(streamsResponse.data, users),
                },
                pagination: { nextCursor: streamsResponse.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const getChannel = async ({ userLogin }) => {
    const key = `v2:twitch:channel:${userLogin.toLowerCase()}`;

    try {
        return await withCache(key, CACHE_TTL.CHANNEL, async () => {
            const user = await resolveUserByLogin(userLogin);
            const errors = [];
            const [channelsResult, streamsResult] = await Promise.allSettled([
                twitchClient.getChannelsByBroadcasterIds([user.id]),
                twitchClient.getStreams({ userLogins: [user.login], first: 1, type: "live" }),
            ]);

            const channel = channelsResult.status === "fulfilled"
                ? channelsResult.value[0] || null
                : null;
            const liveStream = streamsResult.status === "fulfilled"
                ? streamsResult.value.data[0] || null
                : null;

            if (channelsResult.status === "rejected") {
                errors.push({ section: "channel", code: "TWITCH_API_ERROR" });
            }
            if (streamsResult.status === "rejected") {
                errors.push({ section: "liveStream", code: "TWITCH_API_ERROR" });
            }

            return {
                data: toChannelDto({ user, channel, liveStream }),
                ...(errors.length ? { errors } : {}),
                meta: { generatedAt: nowIso(), partial: errors.length > 0 },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const getChannelVideos = async ({ userLogin, cursor, limit }) => {
    const key = `v2:twitch:channel:${userLogin.toLowerCase()}:videos:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.VIDEOS, async () => {
            const user = await resolveUserByLogin(userLogin);
            const response = await twitchClient.getVideosByUser(user.id, {
                first: limit,
                after: cursor,
                type: "all",
            });

            return {
                data: response.data.map(toVideoDto),
                pagination: { nextCursor: response.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const searchChannels = async ({ query, cursor, limit }) => {
    const normalizedQuery = query.toLowerCase();
    const key = `v2:twitch:search:channels:${encodeURIComponent(normalizedQuery)}:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.SEARCH_CHANNELS, async () => {
            const response = await twitchClient.searchChannels({
                query,
                first: limit,
                after: cursor,
            });
            const data = response.data
                .map(toSearchChannelDto)
                .sort((left, right) => Number(right.isLive) - Number(left.isLive));

            return {
                data,
                pagination: { nextCursor: response.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

const searchCategories = async ({ query, cursor, limit }) => {
    const normalizedQuery = query.toLowerCase();
    const key = `v2:twitch:search:categories:${encodeURIComponent(normalizedQuery)}:${cursor || "first"}:limit:${limit}`;

    try {
        return await withCache(key, CACHE_TTL.SEARCH_CATEGORIES, async () => {
            const response = await twitchClient.searchCategories({
                query,
                first: limit,
                after: cursor,
            });

            return {
                data: response.data.map(toGameDto),
                pagination: { nextCursor: response.pagination?.cursor || null },
                meta: { generatedAt: nowIso(), partial: false },
            };
        });
    } catch (error) {
        throw toTwitchError(error);
    }
};

module.exports = {
    getCategories,
    getCategoryStreams,
    getChannel,
    getChannelVideos,
    getHome,
    getStreams,
    searchCategories,
    searchChannels,
};
