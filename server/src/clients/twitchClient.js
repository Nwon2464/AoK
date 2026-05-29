const axios = require("axios");

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API_URL = "https://api.twitch.tv/helix";

let cachedToken = null;
let tokenExpiresAt = 0;

const getAppAccessToken = async () => {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const response = await axios.post(TWITCH_AUTH_URL, null, {
        params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials",
        },
    });

    cachedToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

    return cachedToken;
};

const createHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "client-id": process.env.CLIENT_ID,
});

const getTopGames = async ({ first = 20 } = {}) => {
    const token = await getAppAccessToken();
    const response = await axios.get(`${TWITCH_API_URL}/games/top`, {
        headers: createHeaders(token),
        params: { first },
    });

    return response.data;
};

const getVideosByUser = async (userId, { first = 12, after } = {}) => {
    const token = await getAppAccessToken();
    const response = await axios.get(`${TWITCH_API_URL}/videos`, {
        headers: createHeaders(token),
        params: {
            user_id: userId,
            first,
            ...(after ? { after } : {}),
        },
    });

    return response.data;
};

const getStreams = async ({ gameId, first = 12, after, type } = {}) => {
    const token = await getAppAccessToken();
    const response = await axios.get(`${TWITCH_API_URL}/streams`, {
        headers: createHeaders(token),
        params: {
            first,
            ...(gameId ? { game_id: gameId } : {}),
            ...(after ? { after } : {}),
            ...(type ? { type } : {}),
        },
    });

    return response.data;
};

const getUsersByIds = async (userIds) => {
    if (!userIds.length) {
        return [];
    }

    const token = await getAppAccessToken();
    const response = await axios.get(`${TWITCH_API_URL}/users`, {
        headers: createHeaders(token),
        params: {
            id: userIds,
        },
        paramsSerializer: {
            indexes: null,
        },
    });

    return response.data.data;
};

module.exports = {
    getTopGames,
    getVideosByUser,
    getStreams,
    getUsersByIds,
};
