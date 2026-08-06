const axios = require("axios");

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API_URL = "https://api.twitch.tv/helix";
const TWITCH_REQUEST_TIMEOUT_MS = 8000;
const repeatedParamsSerializer = { indexes: null };

const twitchApi = axios.create({
    baseURL: TWITCH_API_URL,
    timeout: TWITCH_REQUEST_TIMEOUT_MS,
});

let cachedToken = null;
let tokenExpiresAt = 0;
let tokenRequest = null;
let lastRateLimit = null;

const clearCachedToken = () => {
    cachedToken = null;
    tokenExpiresAt = 0;
};

const requestNewToken = async () => {
    const response = await axios.post(TWITCH_AUTH_URL, null, {
        params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials",
        },
        timeout: TWITCH_REQUEST_TIMEOUT_MS,
    });

    cachedToken = response.data.access_token;
    tokenExpiresAt = Date.now() + Math.max(response.data.expires_in - 60, 0) * 1000;
    return cachedToken;
};

const getAppAccessToken = async () => {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    if (!tokenRequest) {
        tokenRequest = requestNewToken().finally(() => {
            tokenRequest = null;
        });
    }

    return tokenRequest;
};

const createHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "client-id": process.env.CLIENT_ID,
});

const captureRateLimit = (headers) => {
    if (!headers["ratelimit-limit"]) {
        return;
    }

    lastRateLimit = {
        limit: Number(headers["ratelimit-limit"]),
        remaining: Number(headers["ratelimit-remaining"]),
        resetAt: Number(headers["ratelimit-reset"]),
    };
};

const authorizedGet = async (path, config = {}, mayRetry = true) => {
    const token = await getAppAccessToken();

    try {
        const response = await twitchApi.get(path, {
            ...config,
            headers: {
                ...config.headers,
                ...createHeaders(token),
            },
        });

        captureRateLimit(response.headers);
        return response.data;
    } catch (error) {
        if (mayRetry && error.response?.status === 401) {
            clearCachedToken();
            return authorizedGet(path, config, false);
        }

        throw error;
    }
};

const getTopGames = ({ first = 20, after } = {}) => authorizedGet("/games/top", {
    params: {
        first,
        ...(after ? { after } : {}),
    },
});

const searchCategories = ({ query, first = 10, after } = {}) => (
    authorizedGet("/search/categories", {
        params: {
            query,
            first,
            ...(after ? { after } : {}),
        },
    })
);

const searchChannels = ({ query, first = 10, after } = {}) => (
    authorizedGet("/search/channels", {
        params: {
            query,
            live_only: false,
            first,
            ...(after ? { after } : {}),
        },
    })
);

const getVideosByUser = (
    userId,
    { first = 12, after, type = "all" } = {}
) => authorizedGet("/videos", {
    params: {
        user_id: userId,
        first,
        type,
        ...(after ? { after } : {}),
    },
});

const getStreams = ({
    gameId,
    gameIds,
    userIds,
    userLogins,
    first = 12,
    after,
    type,
} = {}) => authorizedGet("/streams", {
    params: {
        first,
        ...(gameIds?.length ? { game_id: gameIds } : {}),
        ...(!gameIds?.length && gameId ? { game_id: gameId } : {}),
        ...(userIds?.length ? { user_id: userIds } : {}),
        ...(userLogins?.length ? { user_login: userLogins } : {}),
        ...(after ? { after } : {}),
        ...(type ? { type } : {}),
    },
    paramsSerializer: repeatedParamsSerializer,
});

const getUsers = async ({ ids = [], logins = [] } = {}) => {
    if (!ids.length && !logins.length) {
        return [];
    }

    const response = await authorizedGet("/users", {
        params: {
            ...(ids.length ? { id: ids } : {}),
            ...(logins.length ? { login: logins } : {}),
        },
        paramsSerializer: repeatedParamsSerializer,
    });

    return response.data;
};

const getUsersByIds = (userIds) => getUsers({ ids: userIds });
const getUsersByLogins = (userLogins) => getUsers({ logins: userLogins });

const getGamesByIds = async (gameIds) => {
    if (!gameIds.length) {
        return [];
    }

    const response = await authorizedGet("/games", {
        params: { id: gameIds },
        paramsSerializer: repeatedParamsSerializer,
    });

    return response.data;
};

const getChannelsByBroadcasterIds = async (broadcasterIds) => {
    if (!broadcasterIds.length) {
        return [];
    }

    const response = await authorizedGet("/channels", {
        params: { broadcaster_id: broadcasterIds },
        paramsSerializer: repeatedParamsSerializer,
    });

    return response.data;
};

const getRateLimitSnapshot = () => lastRateLimit && { ...lastRateLimit };

module.exports = {
    getChannelsByBroadcasterIds,
    getGamesByIds,
    getRateLimitSnapshot,
    getStreams,
    getTopGames,
    getUsersByIds,
    getUsersByLogins,
    getVideosByUser,
    searchCategories,
    searchChannels,
};
