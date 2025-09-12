import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashIdFrameLoading = (props) => {
  return (
    <>
      <div style={{ width: "100%", "z-index": "2", backgroundColor: "#1f1f23" }} >

        <React.Fragment key={"1"}>
          <Skeleton style={{ backgroundImage: "none", backgroundColor: "#1f1f23" }} width={"300%"} height={"40rem"} />{" "}
        </React.Fragment>

      </div>

    </>
  );
};

export default SlashIdFrameLoading;
