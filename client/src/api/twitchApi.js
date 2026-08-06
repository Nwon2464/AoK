import axios from "axios";

import { DEPLOYMENT_URL } from "./config";

export const getTwitchHome = () => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/home`)
);

export const getTwitchStreams = ({ cursor, limit = 8 }) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/streams`, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);

export const getTwitchCategories = ({ cursor, limit = 15 }) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/categories`, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);

export const getTwitchCategoryStreams = (gameId, { cursor, limit = 4 }) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/categories/${gameId}/streams`, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);

export const getTwitchChannel = (userLogin) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/channels/${encodeURIComponent(userLogin)}`)
);

export const getTwitchChannelVideos = (userLogin, { cursor, limit = 12 }) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/channels/${encodeURIComponent(userLogin)}/videos`, {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);

export const searchTwitchChannels = (query, { cursor, limit = 10 } = {}) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/search/channels`, {
    params: {
      query,
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);

export const searchTwitchCategories = (query, { cursor, limit = 10 } = {}) => (
  axios.get(`${DEPLOYMENT_URL}/api/v2/search/categories`, {
    params: {
      query,
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })
);
