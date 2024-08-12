import React from "react";
import {Link} from "react-router-dom";

const SlashCategorySubHeader = () => {

    return (
        <div className="app-pd-l-2 app-pd-r-2 app-mg-b-1">
            <div className="app-flex app-full-width app-relative app-height-15">
                <div
                    className="app-font-size-9 app-flex app-flex-grow-1 app-justify-content-start app-full-height app-align-items-center">
                    {/* <div className="app-full-height app-align-items-center app-flex app-font-weight">
                    <Link
                        className="app-block app-full-height app-full-width app-pd-r-1"
                        to="/"
                    >
                        Live Channels
                    </Link>
                    </div>
                    */}
                    <div className="app-flex app-flex-column app-full-height">
                        <div
                            className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center">
                            <Link to="/">
                                <h3 className="app-flex app-flex-column app-font-size-9 app-cursor-pointer">
                                    Live Channels
                                </h3>
                            </Link>
                        </div>
                        <div
                            style={{
                            marginTop: 5
                        }}
                            className="navigation-link-indicator-container">
                            <div className="navigation-link-active-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlashCategorySubHeader;
