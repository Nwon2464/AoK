import React, { useEffect, useState } from "react";
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
import NotSupport from "./error/NotSupport";
const App = (props) => {
    useEffect(() => {
        props.fetchAuth();
        props.fetchActiveLiveTwitch();
        props.fetchTopgames();
    }, []);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            console.log(window.innerWidth);
            if (window.innerWidth < 1025) {
                setShowWarning(true);
            } else {
                setShowWarning(false);
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <div className="app-flex app-flex-column app-flex-nowrap app-bottom-0 app-left-0 app-right-0 app-top-0 app-absolute">

            <Router history={history}>
                {showWarning ? <NotSupport /> :
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

                }
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
