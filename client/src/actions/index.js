import history from "../history";
import {
  JWT_AUTH,
  AUTH_ERROR_CLEAR,
  LOADING_SPINNER,
  SHOW_MODAL,
  LOGIN_ERROR,
  SIGNUP_ERROR,
  SIGN_IN,
  CLOSE_MODAL,
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
} from "./types";

import { jwtDecode } from "jwt-decode";
import { getCurrentUser, login, signUp } from "../api/authApi";
import {
  getCategoryStreamsPage,
  getCategoriesPage,
  getHomeTwitchData,
  getLiveStreamsPage,
} from "../services/twitchService";

const LIVE_CHANNEL_INCREMENT = {
  feed: 4,
  sidebar: 5,
};

const decodeValidAuthToken = (token) => {
  const data = jwtDecode(token);

  if (!data.username || (data.exp && data.exp * 1000 <= Date.now())) {
    throw new Error("The authentication token is invalid or expired.");
  }

  return data;
};

export const fetchHomeTwitch = () => async (dispatch) => {
  dispatch({ type: TWITCH_HOME_REQUEST });

  try {
    const data = await getHomeTwitchData();
    dispatch({ type: TWITCH_HOME_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response?.data?.message || "Unable to load Twitch data.";
    dispatch({ type: TWITCH_HOME_FAILURE, payload: message });
  }
};

export const fetchMoreCategoryStreams = (gameId) => async (dispatch, getState) => {
  const category = getState().twitch.popularCategories
    .find(({ game }) => game.id === gameId);

  if (!category || category.loadingMore || !category.nextCursor) {
    return;
  }

  dispatch({ type: TWITCH_CATEGORY_MORE_REQUEST, payload: { gameId } });

  try {
    const page = await getCategoryStreamsPage(gameId, category.nextCursor);
    dispatch({
      type: TWITCH_CATEGORY_MORE_SUCCESS,
      payload: { gameId, ...page },
    });
  } catch (error) {
    const message = error.response?.data?.message || "Unable to load more channels.";
    dispatch({
      type: TWITCH_CATEGORY_MORE_FAILURE,
      payload: { gameId, message },
    });
  }
};

export const showMoreLiveChannels = (consumer) => async (dispatch, getState) => {
  const increment = LIVE_CHANNEL_INCREMENT[consumer];

  if (!increment) {
    return;
  }

  const twitch = getState().twitch;
  const visibleCount = consumer === "sidebar"
    ? twitch.sidebarVisibleCount
    : twitch.feedVisibleCount;
  const nextVisibleCount = visibleCount + increment;

  if (nextVisibleCount <= twitch.activeLiveTwitch.length
      || !twitch.liveChannelsNextCursor) {
    dispatch({
      type: TWITCH_LIVE_REVEAL,
      payload: { consumer, visibleCount: nextVisibleCount },
    });
    return;
  }

  if (twitch.liveChannelsLoadingMore) {
    return;
  }

  dispatch({ type: TWITCH_LIVE_MORE_REQUEST, payload: { consumer } });

  try {
    const page = await getLiveStreamsPage(twitch.liveChannelsNextCursor);
    dispatch({
      type: TWITCH_LIVE_MORE_SUCCESS,
      payload: { consumer, visibleCount: nextVisibleCount, ...page },
    });
  } catch (error) {
    const message = error.response?.data?.message || "Unable to load more channels.";
    dispatch({
      type: TWITCH_LIVE_MORE_FAILURE,
      payload: { consumer, message },
    });
  }
};

export const fetchMoreTopGames = () => async (dispatch, getState) => {
  const twitch = getState().twitch;

  if (twitch.topGamesLoadingMore || !twitch.topGamesNextCursor) {
    return;
  }

  dispatch({ type: TWITCH_GAMES_MORE_REQUEST });

  try {
    const page = await getCategoriesPage(twitch.topGamesNextCursor);
    dispatch({ type: TWITCH_GAMES_MORE_SUCCESS, payload: page });
  } catch (error) {
    const message = error.response?.data?.message || "Unable to load more categories.";
    dispatch({ type: TWITCH_GAMES_MORE_FAILURE, payload: message });
  }
};


export const fetchAuth = () => async (dispatch) => {
  if (localStorage.token) {
    try {
      const data = decodeValidAuthToken(localStorage.token);
      const response = await getCurrentUser(localStorage.token);
      const username = response.data?.user?.username;
      if (!username || username !== data.username) {
        throw new Error("The authenticated user response is invalid.");
      }
      localStorage.userInfo = username;
      dispatch({ type: JWT_AUTH, payload: username });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      dispatch({ type: JWT_AUTH, payload: false });
    }
  } else {
    dispatch({ type: JWT_AUTH, payload: false });
  }
};

export const completeGoogleLogin = (token) => async (dispatch) => {
  try {
    const data = decodeValidAuthToken(token);
    const response = await getCurrentUser(token);
    const username = response.data?.user?.username;
    if (!username || username !== data.username) {
      throw new Error("The authenticated user response is invalid.");
    }

    localStorage.token = token;
    localStorage.userInfo = username;
    dispatch({ type: JWT_AUTH, payload: username });
    return true;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    dispatch({ type: JWT_AUTH, payload: false });
    return false;
  }
};


export const signUpCreate = (formValues) => (dispatch) => {
  dispatch({ type: AUTH_ERROR_CLEAR });
  dispatch({ type: LOADING_SPINNER, payload: true });
  signUp(formValues)
    .then((res) => {
      localStorage.token = res.data.token;
      localStorage.userInfo = res.data.user.username;
      dispatch({ type: JWT_AUTH, payload: res.data.user.username });
      dispatch({ type: AUTH_ERROR_CLEAR });
      dispatch({ type: LOADING_SPINNER, payload: false });
      history.push("/");
    })
    .catch((error) => {
      dispatch({ type: LOADING_SPINNER, payload: false });
      dispatch({
        type: SIGNUP_ERROR,
        payload: error.response?.data?.message || "Unable to create the account.",
      });
    });
};

export const logIn = (formValues) => (dispatch) => {
  dispatch({ type: AUTH_ERROR_CLEAR });
  dispatch({ type: LOADING_SPINNER, payload: true });
  login(formValues)
    .then((res) => {
      localStorage.token = res.data.token;
      localStorage.userInfo = res.data.user.username;
      dispatch({ type: JWT_AUTH, payload: res.data.user.username });
      dispatch({ type: AUTH_ERROR_CLEAR });
      dispatch({ type: LOADING_SPINNER, payload: false });
      history.push("/");
    })
    .catch((error) => {
      dispatch({ type: LOADING_SPINNER, payload: false });
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response?.data?.message || "Unable to log in.",
      });
    });
};

export const clearAuthError = () => ({ type: AUTH_ERROR_CLEAR });
export const jwtlogOut = () => async (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  dispatch({ type: AUTH_ERROR_CLEAR });
  dispatch({ type: JWT_AUTH, payload: false });
  history.push("/");
};


export const showModal = (trueOrFalse) => {
  return {
    type: SHOW_MODAL,
    payload: trueOrFalse,
  };
};


export const closeModal = (trueOrFalse) => {
  return {
    type: CLOSE_MODAL,
    payload: trueOrFalse,
  };
};

export const signIn = (userProfile) => {
  return {
    type: SIGN_IN,
    payload: userProfile,
  };
};
