import {
  getGroupedTwitchStreams,
  getLiveChannels,
  getTopGames,
} from "../api/twitchApi";

const replaceImageSize = (url, width, height) => (
  url.replace("{width}", width).replace("{height}", height)
);

const withBoxArtSize = (game, width = "188", height = "250") => ({
  ...game,
  box_art_url: replaceImageSize(game.box_art_url, width, height),
});

const withThumbnailSize = (stream, width = "440", height = "248") => ({
  ...stream,
  thumbnail_url: replaceImageSize(stream.thumbnail_url, width, height),
});

export const getHomeTwitchData = async () => {
  const topGamesResponse = await getTopGames();
  const groupedStreamsResponse = await getGroupedTwitchStreams();

  return {
    topGames: topGamesResponse.data.slice(1, 13).map((game) => withBoxArtSize(game)),
    fallGuy: groupedStreamsResponse.data.fallGuy.map((stream) => withThumbnailSize(stream)),
    justChat: groupedStreamsResponse.data.justChat.map((stream) => withThumbnailSize(stream)),
    fortNite: groupedStreamsResponse.data.fortNite.map((stream) => withThumbnailSize(stream)),
    mineCraft: groupedStreamsResponse.data.mineCraft.map((stream) => withThumbnailSize(stream)),
  };
};

export const getActiveLiveTwitch = async () => {
  const response = await getLiveChannels();

  return response.data.data.map((stream) => withThumbnailSize(stream));
};
