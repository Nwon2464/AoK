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
import { response } from "express";

const DEPLOYMENT_URL="https://server-ashy-omega-14.vercel.app";



export const fetchActiveLiveTwitch = () => async (dispatch) => {
 
  const responseAll = await axios.get(
    `/api/v1/twitch/streams`
    // "/api/v1/twitch/streams"
  );
  console.log(responseAll.data, "Action");  
  let dataStream_data= responseAll.data.frontPage.allStreams;
  dataStream_data.map((game) => {
    let newUrl = game.thumbnail_url
      .replace("{width}", "440")
      .replace("{height}", "248");
    game.thumbnail_url = newUrl;
  });
  dispatch({ type: "ACTION_LIVE_STREAMS", payload: dataStream_data });

  let dataTopGames = responseAll.data.frontPage.topGames;
  dataTopGames.map((game) => {
    let newUrl = game.box_art_url
      .replace("{width}", "188")
      .replace("{height}", "250");
    game.box_art_url = newUrl;
  
  });
  dispatch({ type: "ACTION_TOP_GAMES", payload: dataTopGames });
};



export const fetchAuth = () => async (dispatch) => {
    if(localStorage.token){
        const data= jwtDecode(localStorage.token);
        localStorage.userInfo = data.username;
        dispatch({ type: JWT_AUTH, payload: data.username });
    }else{
      dispatch({ type: JWT_AUTH, payload: false }); 
    }
};


export const signUpCreate = (formValues) => (dispatch, getState) => {
    dispatch({ type: LOADING_SPINNER, payload: true });
    axios
      .post(`/auth/signup`, {
        ...formValues,
      })
      .then((res) => {
        console.log("signup aftered",res);
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
      .post(`/auth/login`, {
        ...formValues,
      })
      .then((res) => {
        localStorage.token = res.data.token;
        localStorage.userInfo=res.data.user.username;
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
    if(localStorage.token){
      localStorage.token ="";
      localStorage.userInfo ="";
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

  