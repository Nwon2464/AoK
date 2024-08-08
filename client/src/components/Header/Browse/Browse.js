import React, { useState } from "react";
import { Link } from "react-router-dom";

const Browse = () => {
    const [navIndicatorActive, setNavIndicatorActive] = useState("");
    const toggleMultipleIndicator = (value) => {
      setNavIndicatorActive(value);
    };

    return (
        <div className="app-flex app-flex-column app-full-height app-pd-x-1">
            <div
                onClick={() => toggleMultipleIndicator("Browse")}
                className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center"
            >
                <Link to="/category/all">
                <h3 className="app-flex app-flex-column app-font-size-7 app-cursor-pointer">
                    Browse
                </h3>
                </Link>
            </div>
            <div className="navigation-link-indicator-container">
                {navIndicatorActive === "Browse" && (
                <div className="navigation-link-active-indicator"></div>
                )}
            </div>
        </div>
    );
};
export default Browse;