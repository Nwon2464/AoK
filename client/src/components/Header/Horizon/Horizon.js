import React from "react";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const Horizon = () => {
    return (
        <div className="app-flex app-align-items-center app-full-height app-pd-x-1 app-justify-content-center">
          <button className="app-cursor-pointer app-inline-flex app-align-items-center app-align-middle app-relative app-justify-content-center">
            <div style={{ width: "2.5rem", height: "2.5rem" }}>
              <MoreHorizIcon style={{ width: "100%", height: "100%" }} />
            </div>
          </button>
        </div>
    );
};
export default Horizon;