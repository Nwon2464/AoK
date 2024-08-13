import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashIdFrameLoading = (props) => {
  return (
    <>
        <div style={{ width: "100%",  position:"absolute", "z-index":"2"}} >
         
            <React.Fragment key={"1"}>
                <Skeleton width={"300%"} height={"40rem"} />{" "}
            </React.Fragment>
        
        </div>

    </>
  );
};

export default SlashIdFrameLoading;
