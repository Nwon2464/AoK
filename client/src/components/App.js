import React,{useEffect} from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";
import { fetchAuth, jwtlogOut, showModal } from "../actions";
import history from "../history";
import Header from "./Header/Header";

const App = (props) => {
    useEffect(() => {
        props.fetchAuth();
    }, []);
    return (
    <div className="app-flex app-flex-column app-flex-nowrap app-bottom-0 app-left-0 app-right-0 app-top-0 app-absolute">
        <Router history={history}>
            <div className="app-flex app-flex-column app-flex-nowrap app-full-height">
                <Header />
                {/* <Switch>
                    <Route exact={true} path="/" component={landing}/>
                </Switch> */}
            </div>
        </Router>
    </div>
    );
};
const mapStateToProps = (state) => {
    return {
    //   streams: Object.values(state.streams),
      modal: state.modal.showModal,
      auth: state.auth,
      twitch: state.twitch,
    };
  };

export default connect(mapStateToProps, {
    // fetchStreams,
    showModal,
    // fetchActiveLiveTwitch,
    // fetchActiveLiveGameContents,
    fetchAuth,
    jwtlogOut,
})(App);
