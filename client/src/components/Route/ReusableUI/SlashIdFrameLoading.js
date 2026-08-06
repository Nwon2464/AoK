import React from "react";
import Skeleton from "react-loading-skeleton";

const SlashIdFrameLoading = () => (
  <div
    className="channel-player-frame"
    aria-busy="true"
    aria-label="Loading channel"
  >
    <Skeleton
      width="100%"
      height="100%"
      style={{ backgroundImage: "none", backgroundColor: "var(--theme-control)" }}
    />
  </div>
);

export default SlashIdFrameLoading;
