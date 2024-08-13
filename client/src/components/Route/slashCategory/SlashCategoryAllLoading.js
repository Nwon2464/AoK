import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashCategoryAllLoading = (props) => {
  return (
    <>
        <div style={{ width: "100%", marginTop: 20}}>
          {Array(10)
            .fill()
            .map((e, i) => {
              return (
                <React.Fragment key={i}>
                  <Skeleton width={250} height={350} />{" "}
                </React.Fragment>
              );
            })}
        </div>
    </>
  );
};

export default SlashCategoryAllLoading;
