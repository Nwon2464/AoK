import React, { useState } from "react";
import {Link} from "react-router-dom";
const Music = () => {
    const [navIndicatorActive, setNavIndicatorActive] = useState("");
    const toggleMultipleIndicator = (value) => {
      setNavIndicatorActive(value);
    };

    return (
        <div className="app-flex app-flex-column app-full-height app-pd-x-1">
            <div
              onClick={() => toggleMultipleIndicator("Music")}
              className="app-align-self-center app-flex app-full-height  app-justify-content-center app-align-items-center"
            >
              <Link to="/music">
                <h3 className="app-flex app-flex-column app-font-size-7 app-cursor-pointer">
                  Music
                </h3>
              </Link>
            </div>
            <div className="navigation-link-indicator-container">
              {navIndicatorActive === "Music" && (
                <div className="navigation-link-active-indicator"></div>
              )}
            </div>
        </div>
    );
};

export default Music;
