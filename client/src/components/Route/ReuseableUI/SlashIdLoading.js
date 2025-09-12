import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashIdLoading = (props) => {
  return (
    <>
      <div style={{ width: "100%", "z-index": "2", height: "100vh", backgroundImage: "none", backgroundColor: "#1f1f23" }}  >

        <React.Fragment key={0}>
          <Skeleton style={{ backgroundImage: "none", backgroundColor: "grey", width: "100%", height: "100%" }} />{" "}
        </React.Fragment>

      </div>

    </>
  );
};

export default SlashIdLoading;
