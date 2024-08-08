import React, { useState } from "react";
import {Link} from "react-router-dom";

const Esports = () =>{
    const [navIndicatorActive, setNavIndicatorActive] = useState("");
    const toggleMultipleIndicator = (value) => {
      setNavIndicatorActive(value);
    };

    return (
        <div className="app-flex app-flex-column app-full-height app-pd-x-1">
            <div
              onClick={() => toggleMultipleIndicator("Esports")}
              className="app-align-self-center app-flex app-full-height  app-justify-content-center app-align-items-center"
            >
              <Link to="/esports">
                <h3 className="app-flex app-flex-column app-font-size-7 app-cursor-pointer">
                  Esports
                </h3>
              </Link>
            </div>
            <div className="navigation-link-indicator-container">
              {navIndicatorActive === "Esports" && (
                <div className="navigation-link-active-indicator"></div>
              )}
            </div>
        </div>
    );
};

export default Esports;
