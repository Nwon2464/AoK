import {
    AUTH_ERROR_CLEAR,
    SIGNUP_ERROR,
    LOGIN_ERROR,
  } from "../actions/types";
  
  const initial_state = {
    errorMessage: "",
  };
  const errorReducer = (state = initial_state, action) => {
    switch (action.type) {
      case SIGNUP_ERROR:
        return { ...state, errorMessage: action.payload };
      case AUTH_ERROR_CLEAR:
        return { ...state, errorMessage: "" };
      case LOGIN_ERROR:
        return { ...state, errorMessage: action.payload };
      default:
        return state;
    }
  };

  export default errorReducer;
  
