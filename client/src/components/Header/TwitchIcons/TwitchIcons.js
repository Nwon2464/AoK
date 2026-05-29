import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as TwitchIcon } from "../headerIcons/twitch-seeklogo.com.svg";
const TwitchIcons = (props) => {

  return (
    <Link
      onClick={() => props.toggleMultipleIndicator("")}
      className="app-mg-l-1 app-flex app-justify-content-center app-align-items-center"
      to="/"

    >
      <div className="app-inline-flex app-pd-05">
        <TwitchIcon className="app__order__0 app__order__animation__1"
          width={30} height={30} />
      </div>
    </Link>
  );
};

export default TwitchIcons;
