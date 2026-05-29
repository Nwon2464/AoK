import { LOADING_SPINNER } from "../actions/types";
const initial_state = {
  loading: false,
};
const loadingReducer = (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_SPINNER:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default loadingReducer;
