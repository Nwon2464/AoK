import {
    TWITCH_HOME_FAILURE,
    TWITCH_HOME_REQUEST,
    TWITCH_HOME_SUCCESS,
    TWITCH_CATEGORY_MORE_FAILURE,
    TWITCH_CATEGORY_MORE_REQUEST,
    TWITCH_CATEGORY_MORE_SUCCESS,
    TWITCH_LIVE_MORE_FAILURE,
    TWITCH_LIVE_MORE_REQUEST,
    TWITCH_LIVE_MORE_SUCCESS,
    TWITCH_LIVE_REVEAL,
    TWITCH_GAMES_MORE_FAILURE,
    TWITCH_GAMES_MORE_REQUEST,
    TWITCH_GAMES_MORE_SUCCESS,
} from "../actions/types";

const updateCategory = (categories, gameId, update) => categories.map((category) => (
  category.game.id === gameId ? update(category) : category
));

const appendUniqueStreams = (currentStreams, nextStreams) => {
  const streamMap = new Map(
    [...currentStreams, ...nextStreams].map((stream) => [stream.id, stream])
  );

  return [...streamMap.values()];
};

const appendUniqueGames = (currentGames, nextGames) => {
  const gameMap = new Map(
    [...currentGames, ...nextGames].map((game) => [game.id, game])
  );

  return [...gameMap.values()];
};

const withLiveVisibleCount = (state, consumer, requestedCount) => ({
  ...state,
  [consumer === "sidebar" ? "sidebarVisibleCount" : "feedVisibleCount"]:
    Math.min(requestedCount, state.activeLiveTwitch.length),
});

const INITIAL_STATE = {
    activeLiveTwitch: [],
    liveChannelsNextCursor: null,
    liveChannelsLoadingMore: false,
    liveChannelsLoadingConsumer: null,
    liveChannelsLoadMoreError: null,
    liveChannelsErrorConsumer: null,
    sidebarVisibleCount: 5,
    feedVisibleCount: 4,
    activeCategoryGames: [],
    topGamesNextCursor: null,
    topGamesLoadingMore: false,
    topGamesLoadMoreError: null,
    popularCategories: [],
    homeLoading: true,
    homeError: null,
    homePartial: false,
    homeSectionErrors: [],
  };
  const twitchReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case TWITCH_HOME_REQUEST:
        return {
          ...state,
          ...INITIAL_STATE,
          homeLoading: true,
          homeError: null,
        };
      case TWITCH_HOME_SUCCESS:
        return {
          ...state,
          activeLiveTwitch: action.payload.liveChannels,
          liveChannelsNextCursor: action.payload.liveChannelsNextCursor,
          liveChannelsLoadingMore: false,
          liveChannelsLoadingConsumer: null,
          liveChannelsLoadMoreError: null,
          liveChannelsErrorConsumer: null,
          sidebarVisibleCount: 5,
          feedVisibleCount: 4,
          activeCategoryGames: action.payload.topGames,
          topGamesNextCursor: action.payload.topGamesNextCursor,
          topGamesLoadingMore: false,
          topGamesLoadMoreError: null,
          popularCategories: action.payload.popularCategories,
          homeLoading: false,
          homeError: null,
          homePartial: action.payload.partial,
          homeSectionErrors: action.payload.errors,
        };
      case TWITCH_HOME_FAILURE:
        return {
          ...state,
          homeLoading: false,
          homeError: action.payload,
          homePartial: false,
          homeSectionErrors: [],
        };
      case TWITCH_CATEGORY_MORE_REQUEST:
        return {
          ...state,
          popularCategories: updateCategory(
            state.popularCategories,
            action.payload.gameId,
            (category) => ({ ...category, loadingMore: true, loadMoreError: null })
          ),
        };
      case TWITCH_CATEGORY_MORE_SUCCESS:
        return {
          ...state,
          popularCategories: updateCategory(
            state.popularCategories,
            action.payload.gameId,
            (category) => ({
              ...category,
              streams: appendUniqueStreams(category.streams, action.payload.streams),
              nextCursor: action.payload.nextCursor,
              loadingMore: false,
              loadMoreError: null,
            })
          ),
        };
      case TWITCH_CATEGORY_MORE_FAILURE:
        return {
          ...state,
          popularCategories: updateCategory(
            state.popularCategories,
            action.payload.gameId,
            (category) => ({
              ...category,
              loadingMore: false,
              loadMoreError: action.payload.message,
            })
          ),
        };
      case TWITCH_LIVE_REVEAL:
        return withLiveVisibleCount(
          state,
          action.payload.consumer,
          action.payload.visibleCount
        );
      case TWITCH_LIVE_MORE_REQUEST:
        return {
          ...state,
          liveChannelsLoadingMore: true,
          liveChannelsLoadingConsumer: action.payload.consumer,
          liveChannelsLoadMoreError: null,
          liveChannelsErrorConsumer: action.payload.consumer,
        };
      case TWITCH_LIVE_MORE_SUCCESS: {
        const activeLiveTwitch = appendUniqueStreams(
          state.activeLiveTwitch,
          action.payload.streams
        );
        const nextState = {
          ...state,
          activeLiveTwitch,
          liveChannelsNextCursor: action.payload.nextCursor,
          liveChannelsLoadingMore: false,
          liveChannelsLoadingConsumer: null,
          liveChannelsLoadMoreError: null,
          liveChannelsErrorConsumer: null,
        };

        return withLiveVisibleCount(
          nextState,
          action.payload.consumer,
          action.payload.visibleCount
        );
      }
      case TWITCH_LIVE_MORE_FAILURE:
        return {
          ...state,
          liveChannelsLoadingMore: false,
          liveChannelsLoadingConsumer: null,
          liveChannelsLoadMoreError: action.payload.message,
          liveChannelsErrorConsumer: action.payload.consumer,
        };
      case TWITCH_GAMES_MORE_REQUEST:
        return {
          ...state,
          topGamesLoadingMore: true,
          topGamesLoadMoreError: null,
        };
      case TWITCH_GAMES_MORE_SUCCESS:
        return {
          ...state,
          activeCategoryGames: appendUniqueGames(
            state.activeCategoryGames,
            action.payload.games
          ),
          topGamesNextCursor: action.payload.nextCursor,
          topGamesLoadingMore: false,
          topGamesLoadMoreError: null,
        };
      case TWITCH_GAMES_MORE_FAILURE:
        return {
          ...state,
          topGamesLoadingMore: false,
          topGamesLoadMoreError: action.payload,
        };
      default:
        return state;
    }
  };

  export default twitchReducer;
  
