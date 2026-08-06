import {
  TWITCH_HOME_SUCCESS,
  TWITCH_LIVE_MORE_SUCCESS,
  TWITCH_LIVE_REVEAL,
} from "../actions/types";
import twitchReducer from "./twitchReducer";

const stream = (id) => ({ id });

const homeSuccess = {
  type: TWITCH_HOME_SUCCESS,
  payload: {
    liveChannels: Array.from({ length: 8 }, (_, index) => stream(String(index + 1))),
    liveChannelsNextCursor: "next-page",
    topGames: [],
    topGamesNextCursor: "games-next-page",
    popularCategories: [],
    partial: false,
    errors: [],
  },
};

test("home keeps independent sidebar and feed visibility over shared streams", () => {
  const state = twitchReducer(undefined, homeSuccess);

  expect(state.activeLiveTwitch).toHaveLength(8);
  expect(state.sidebarVisibleCount).toBe(5);
  expect(state.feedVisibleCount).toBe(4);
});

test("live pagination appends unique streams and expands only its consumer", () => {
  const homeState = twitchReducer(undefined, homeSuccess);
  const revealedFeedState = twitchReducer(homeState, {
    type: TWITCH_LIVE_REVEAL,
    payload: { consumer: "feed", visibleCount: 8 },
  });
  const paginatedState = twitchReducer(revealedFeedState, {
    type: TWITCH_LIVE_MORE_SUCCESS,
    payload: {
      consumer: "sidebar",
      visibleCount: 10,
      streams: [stream("8"), stream("9"), stream("10")],
      nextCursor: "another-page",
    },
  });

  expect(paginatedState.activeLiveTwitch.map(({ id }) => id)).toEqual([
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  ]);
  expect(paginatedState.sidebarVisibleCount).toBe(10);
  expect(paginatedState.feedVisibleCount).toBe(8);
  expect(paginatedState.liveChannelsNextCursor).toBe("another-page");
});
