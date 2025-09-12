import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashCategoryAllLoading = (props) => {
  return (
    <>
      <div style={{ width: "100%", marginTop: 20 }}>
        {Array(18)
          .fill()
          .map((e, i) => {
            return (
              <React.Fragment key={i}>
                <Skeleton width={250} height={350} style={{ backgroundImage: "none", backgroundColor: "#0e0e10" }} />{" "}
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
};

export default SlashCategoryAllLoading;
