import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";

import "./index.css";
import App from "./components/App";
import reducers from "./reducers";

import { createStore, applyMiddleware, compose } from "redux";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);
const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
   </Provider>,
  rootElement
);
