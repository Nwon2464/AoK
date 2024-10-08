import axios from "axios";
import history from "../history";
import {
  FETCH_AUTH,
  JWT_AUTH,
  LOADING_SPINNER,
  SHOW_MODAL,
  LOGIN_ERROR,
  LOGOUT_AUTH,
  SIGNUP_ERROR_CLOSE,
  SIGNUP_ERROR,
  JWT_AUTH_LOGOUT,
  SIGN_IN,
  SIGN_OUT,
  CLOSE_MODAL,
} from "./types";

import { jwtDecode } from "jwt-decode";

const DEPLOYMENT_URL = "https://server-ashy-omega-14.vercel.app";

export const fetchTopgames = () => async (dispatch) => {
  //expected to be slow loading
  const responseAll = await axios.get(
    `${DEPLOYMENT_URL}/api/v1/twitch/topgames`
  );
  // console.log(responseAll.data);
  let dataTopGames = responseAll.data.slice(1, 13);
  dataTopGames.map((game) => {
    let newUrl = game.box_art_url
      .replace("{width}", "188")
      .replace("{height}", "250");
    game.box_art_url = newUrl;
  });
  dispatch({ type: "ACTION_TOP_GAMES", payload: dataTopGames });



  const res = await axios.get(
    `${DEPLOYMENT_URL}/api/v1/twitch/streams`
  );

  let dataFallGuy = res.data.fallGuy;
  dataFallGuy.map((game) => {
    let newUrl = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = newUrl;
  });
  dispatch({ type: "ACTION_FALLGUY", payload: dataFallGuy });

  let dataJustChat = res.data.justChat;
  dataJustChat.map((game) => {
    let newUrl = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = newUrl;
  });
  dispatch({ type: "ACTION_JUSTCHAT", payload: dataJustChat });

  let dataFortNite = res.data.fortNite;
  dataFortNite.map((game) => {
    let newUrl = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = newUrl;
  });
  dispatch({ type: "ACTION_FORTNITE", payload: dataFortNite });

  let dataMineCraft = res.data.mineCraft;
  dataMineCraft.map((game) => {
    let newUrl = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = newUrl;
  });

  dispatch({ type: "ACTION_MINECRAFT", payload: dataMineCraft });
}

export const fetchActiveLiveTwitch = () => async (dispatch) => {
  const responseAll = await axios.get(
    `${DEPLOYMENT_URL}/api/v1/twitch/channels`
  );
  let fetched_streams = responseAll.data.data;

  fetched_streams.map((game) => {
    let new_url = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = new_url;
  });

  dispatch({ type: "ACTION_LIVE_STREAMS", payload: fetched_streams });
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
  axios
    .post(`${DEPLOYMENT_URL}/auth/signup`, {
      ...formValues,
    })
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
  axios
    .post(`${DEPLOYMENT_URL}/auth/login`, {
      ...formValues,
    })
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

