import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashIdLoading = (props) => {
  return (
    <>
        <div style={{ width: "100%",  position:"absolute", "z-index":"2"}} >
          {Array(5)
            .fill()
            .map((e, i) => {
              return (
                <React.Fragment key={i}>
                  <Skeleton width={300} height={150} />{" "}
                </React.Fragment>
              );
            })}
        </div>

    </>
  );
};

export default SlashIdLoading;
