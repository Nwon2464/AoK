import axios from "axios";

import { DEPLOYMENT_URL } from "./config";

export const getTopGames = () => (
  axios.get(`${DEPLOYMENT_URL}/api/v1/twitch/topgames`)
);

export const getGroupedTwitchStreams = () => (
  axios.get(`${DEPLOYMENT_URL}/api/v1/twitch/streams`)
);

export const getLiveChannels = () => (
  axios.get(`${DEPLOYMENT_URL}/api/v1/twitch/channels`)
);
