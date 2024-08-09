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

// const DEPLOYMENT_URL="https://server-t.vercel.app";
const DEPLOYMENT_URL="http://localhost:5000";

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
// export const logOutAuth = () => async (dispatch) => {
//     return await axios.get(`/auth/logout`).then(()=>{
//       dispatch({ type: LOGOUT_AUTH });
//       history.push("/");
//     });
//   };
  

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

  // export const signOut = () => {
  //   return {
  //     type: SIGN_OUT,
  //   };
  // };
  export const signIn = (userProfile) => {
    return {
      type: SIGN_IN,
      payload: userProfile,
    };
  };

  