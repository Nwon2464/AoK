import history from "../history";
import {
  JWT_AUTH,
  LOADING_SPINNER,
  SHOW_MODAL,
  LOGIN_ERROR,
  SIGNUP_ERROR,
  SIGN_IN,
  CLOSE_MODAL,
  ACTION_FALLGUY,
  ACTION_FORTNITE,
  ACTION_JUSTCHAT,
  ACTION_LIVE_STREAMS,
  ACTION_MINECRAFT,
  ACTION_TOP_GAMES,
} from "./types";

import { jwtDecode } from "jwt-decode";
import { login, signUp } from "../api/authApi";
import {
  getActiveLiveTwitch,
  getHomeTwitchData,
} from "../services/twitchService";

export const fetchTopgames = () => async (dispatch) => {
  const data = await getHomeTwitchData();

  dispatch({ type: ACTION_TOP_GAMES, payload: data.topGames });
  dispatch({ type: ACTION_FALLGUY, payload: data.fallGuy });
  dispatch({ type: ACTION_JUSTCHAT, payload: data.justChat });
  dispatch({ type: ACTION_FORTNITE, payload: data.fortNite });
  dispatch({ type: ACTION_MINECRAFT, payload: data.mineCraft });
};

export const fetchActiveLiveTwitch = () => async (dispatch) => {
  const fetchedStreams = await getActiveLiveTwitch();

  dispatch({ type: ACTION_LIVE_STREAMS, payload: fetchedStreams });
};


export const fetchAuth = () => async (dispatch) => {
  if (localStorage.token) {
    const data = jwtDecode(localStorage.token);
    localStorage.userInfo = data.username;
    dispatch({ type: JWT_AUTH, payload: data.username });
  } else {
    dispatch({ type: JWT_AUTH, payload: false });
  }
};


export const signUpCreate = (formValues) => (dispatch, getState) => {
  dispatch({ type: LOADING_SPINNER, payload: true });
  signUp(formValues)
    .then((res) => {
      console.log("signup aftered", res);
      localStorage.token = res.data.token;
      const username = res.data.user.username;
      setTimeout(() => {
        dispatch({ type: JWT_AUTH, payload: username });
        dispatch({ type: LOADING_SPINNER, payload: false });
        history.push("/");
      }, 2000);
    })
    .catch((error) => {
      setTimeout(() => {
        dispatch({ type: LOADING_SPINNER, payload: false });
        dispatch({ type: SIGNUP_ERROR, payload: error.response.data.message });
      }, 1500);
    });

  // history.push("/dashboard");
};

export const logIn = (formValues) => (dispatch, getState) => {
  dispatch({ type: LOADING_SPINNER, payload: true });
  login(formValues)
    .then((res) => {
      localStorage.token = res.data.token;
      localStorage.userInfo = res.data.user.username;
      const username = res.data.user.username;
      setTimeout(() => {
        dispatch({ type: JWT_AUTH, payload: username });
        dispatch({ type: LOADING_SPINNER, payload: false });
        history.push("/");
        // history.go(0);
      }, 1500);
    })
    .catch((error) => {
      setTimeout(() => {
        dispatch({ type: LOADING_SPINNER, payload: false });
        dispatch({ type: LOGIN_ERROR, payload: error.response.data.message });
      }, 2000);
    });
};
export const jwtlogOut = () => async (dispatch) => {
  if (localStorage.token) {
    localStorage.token = "";
    localStorage.userInfo = "";
    // dispatch({ type: JWT_AUTH, payload: false});
  }
  // dispatch({ type: JWT_AUTH_LOGOUT });

  dispatch({ type: JWT_AUTH, payload: false });
  history.push("/");

  // history.go(0);
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
