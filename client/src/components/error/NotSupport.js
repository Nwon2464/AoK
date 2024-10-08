import React from "react";
import GlitchIcon from "./glitchIcon";
const NotSupport = () => {
    return (
        <div className="app-flex app-justify-content-center app-align-items-center app-full-width app-full-height app-c-text-alt">
            <div className="app-inline-flex app-align-items-center app-error-container">
                <div>
                    <GlitchIcon />
                </div>
                <div className="app-flex app-flex-column app-mg-l-05">

                    <p className="app-font-size-6">
                        For an optimal viewing experience, we recommend resizing your window to a wider format.
                    </p>
                    <p className="app-font-size-6">Our UI is designed to provide the best experience on larger screens.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotSupport;
