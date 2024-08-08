import React,{ useState } from "react";
import {Link} from "react-router-dom";

import { ReactComponent as TwitchIcon } from "../headerIcons/twitch-seeklogo.com.svg";
const TwitchIcons = () => {
  const [navIndicatorActive, setNavIndicatorActive] = useState("");
  const toggleMultipleIndicator = (value) => {
    setNavIndicatorActive(value);
  };

  return (
    <Link
        onClick={() => toggleMultipleIndicator("")}
        className="app-mg-l-1 app-flex app-justify-content-center app-align-items-center"
        to="/"
    >
        <div className="app-inline-flex app-pd-05">
            <TwitchIcon width={30} height={30} />
        </div>
    </Link>
  );
};

export default TwitchIcons;
