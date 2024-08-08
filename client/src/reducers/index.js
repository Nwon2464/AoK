import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { reducer as formReducers } from "redux-form";
// import streamReducer from "./streamReducer";
// import videoReducer from "./videoReducer";
// import selectReducer from "./selectReducer";
import modalReducer from "./modalReducer";
import errorReducer from "./errorReducer";
// import carouselReducer from "./carouselReducer";
import loadingReducer from "./loadingReducer";
import twitchReducer from "./twitchReducer";
import signupLoginReducer from "./signupLoginReducer";
export default combineReducers({
//   carousel: carouselReducers,
  error: errorReducer,
  auth: authReducer,
  form: formReducers,
//   streams: streamReducers,
//   videos: videoReducer,
//   selectedVideo: selectReducer,
  modal: modalReducer,
  loading: loadingReducer,
  join: signupLoginReducer,
  twitch: twitchReducer,
});
