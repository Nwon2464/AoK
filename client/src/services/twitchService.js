import {
  getTwitchCategoryStreams,
  getTwitchCategories,
  getTwitchChannel,
  getTwitchChannelVideos,
  getTwitchHome,
  getTwitchStreams,
  searchTwitchCategories,
  searchTwitchChannels,
} from "../api/twitchApi";

const toCardGame = (game) => ({
  id: game.id,
  name: game.name,
  box_art_url: game.boxArtUrl,
});

const toCardStream = (stream) => ({
  id: stream.id,
  user_id: stream.user.id,
  user_login: stream.user.login,
  user_name: stream.user.displayName,
  profile_image_url: stream.user.profileImageUrl,
  game_id: stream.game.id,
  game_name: stream.game.name,
  title: stream.title,
  type: stream.type,
  viewer_count: stream.viewerCount,
  tags: stream.tags,
  started_at: stream.startedAt,
  language: stream.language,
  thumbnail_url: stream.thumbnailUrl,
  is_mature: stream.isMature,
});

export const getHomeTwitchData = async () => {
  const response = await getTwitchHome();
  const payload = response.data;

  if (!payload || !payload.data) {
    throw new Error("The Twitch home response is invalid.");
  }

  const {
    liveChannels = [],
    liveChannelsPagination,
    topGames = [],
    topGamesPagination,
    popularCategories = [],
  } = payload.data;

  return {
    liveChannels: liveChannels.map(toCardStream),
    liveChannelsNextCursor: liveChannelsPagination?.nextCursor || null,
    topGames: topGames.map(toCardGame),
    topGamesNextCursor: topGamesPagination?.nextCursor || null,
    popularCategories: popularCategories.map(({ game, streams, pagination }) => ({
      game: toCardGame(game),
      streams: streams.map(toCardStream),
      nextCursor: pagination?.nextCursor || null,
      loadingMore: false,
      loadMoreError: null,
    })),
    partial: Boolean(payload.meta?.partial),
    errors: payload.errors || [],
  };
};

export const getCategoriesPage = async (cursor, limit = 15) => {
  const response = await getTwitchCategories({ cursor, limit });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The Twitch categories response is invalid.");
  }

  return {
    games: payload.data.map(toCardGame),
    nextCursor: payload.pagination?.nextCursor || null,
  };
};

export const getLiveStreamsPage = async (cursor) => {
  const response = await getTwitchStreams({ cursor, limit: 8 });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The Twitch streams response is invalid.");
  }

  return {
    streams: payload.data.map(toCardStream),
    nextCursor: payload.pagination?.nextCursor || null,
  };
};

export const getCategoryPage = async (gameId, cursor, limit = 20) => {
  const response = await getTwitchCategoryStreams(gameId, { cursor, limit });
  const payload = response.data;

  if (!payload?.data?.category || !Array.isArray(payload.data.streams)) {
    throw new Error("The Twitch category response is invalid.");
  }

  return {
    category: toCardGame(payload.data.category),
    streams: payload.data.streams.map(toCardStream),
    nextCursor: payload.pagination?.nextCursor || null,
  };
};

export const getCategoryStreamsPage = async (gameId, cursor) => {
  const { streams, nextCursor } = await getCategoryPage(gameId, cursor, 4);
  return { streams, nextCursor };
};

export const getChannelPage = async (userLogin) => {
  const response = await getTwitchChannel(userLogin);
  const payload = response.data;

  if (!payload?.data?.user) {
    throw new Error("The Twitch channel response is invalid.");
  }

  return {
    channel: payload.data,
    partial: Boolean(payload.meta?.partial),
    errors: payload.errors || [],
  };
};

export const getChannelVideosPage = async (userLogin, cursor) => {
  const response = await getTwitchChannelVideos(userLogin, { cursor, limit: 12 });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The Twitch channel videos response is invalid.");
  }

  return {
    videos: payload.data,
    nextCursor: payload.pagination?.nextCursor || null,
  };
};

export const searchChannelsPage = async (query, cursor, limit = 12) => {
  const response = await searchTwitchChannels(query, { cursor, limit });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The Twitch channel search response is invalid.");
  }

  return {
    channels: payload.data,
    nextCursor: payload.pagination?.nextCursor || null,
  };
};

export const searchCategoriesPage = async (query, cursor, limit = 12) => {
  const response = await searchTwitchCategories(query, { cursor, limit });
  const payload = response.data;

  if (!Array.isArray(payload?.data)) {
    throw new Error("The Twitch category search response is invalid.");
  }

  return {
    categories: payload.data.map(toCardGame),
    nextCursor: payload.pagination?.nextCursor || null,
  };
};
