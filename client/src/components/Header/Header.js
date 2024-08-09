import React, {useRef, useState}  from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import "./Header.css";
import TwitchIcons from "./TwitchIcons/TwitchIcons";
import Browse from "./Browse/Browse";
import Esports from "./Esports/Esports";
import Music from "./Music/Music";
import Horizon from "./Horizon/Horizon";
import Search from "./SearchBar/Search";
import RenderAuth from "./RenderAuth/RenderAuth";
import { jwtlogOut, signIn } from "../../actions";

const Header = (props) => {

  return (
    <nav className="app-top-nav app-height-5 app-flex-shrink-0">
      <div className="app-flex app-flex-nowrap app-full-height app-align-items-stretch">
        <div className="app-flex app-flex-grow-1 app-flex-shrink-1 app-justify-content-start app-align-items-stretch app-full-width">
          <TwitchIcons/>
          <div className="app-flex app-flex-row app-full-height app-justify-content-between">
            <Browse/>
            <div className="navigation-link-left-border app-mg-t-1"></div>
            <Esports/>
            <Music/>
          </div>
          <Horizon/>
        </div>
        <Search/>
        <RenderAuth/>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, {
  signIn,
  // signOut,
  jwtlogOut,
  // logOutAuth,
})(Header);