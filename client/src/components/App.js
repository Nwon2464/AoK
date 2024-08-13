import React,{useEffect} from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";
import { fetchAuth, jwtlogOut, showModal, fetchActiveLiveTwitch, fetchTopgames } from "../actions";
import history from "../history";
import Header from "./Header/Header";
import Slash from "./Route/Slash";
import SlashId from "./Route/SlashId";
import SlashCategoryGamesId from "./Route/SlashCategoryGamesId";
import SlashIdVideosAll from "./Route/SlashIdVideosAll";
import SlashCategoryAll from "./Route/SlashCategoryAll";
const App = (props) => {
    useEffect(() => {
        props.fetchAuth();
        props.fetchActiveLiveTwitch();
        props.fetchTopgames();
    }, []);

   


    return (
    <div className="app-flex app-flex-column app-flex-nowrap app-bottom-0 app-left-0 app-right-0 app-top-0 app-absolute">
        <Router history={history}>
            <div className="app-flex app-flex-column app-flex-nowrap app-full-height">
                <Header />

                <Switch>
                    <Route exact path="/" component={Slash} />
                    <Route exact path="/:id" component={SlashId} />
                    <Route exact path="/category/games/:id" component={SlashCategoryGamesId} />
                    <Route exact path="/:id/videos/all" component={SlashIdVideosAll} />
                    <Route exact path="/category/all" component={SlashCategoryAll} />
                </Switch>
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
    fetchActiveLiveTwitch,
    // fetchActiveLiveGameContents,
    fetchAuth,
    jwtlogOut,
    fetchTopgames,
})(App);
