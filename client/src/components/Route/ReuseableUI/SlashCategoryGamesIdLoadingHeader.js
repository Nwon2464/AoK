import React from "react";
import Skeleton from "react-loading-skeleton";
const SlashCategoryGamesIdLoadingHeader = () => {
  return (
    <div style={{ marginLeft: 15 }} className="game__card app-pd-15">
      <div className="card__maxWidth__margin app__tower__gutter">
        <div className="app-flex">
          <div>
            <Skeleton width={180} height={240} />
          </div>
          <div style={{ marginTop: 50, marginLeft: 40 }}>
            <Skeleton width={150} height={40} />
            <div style={{ marginTop: 5, marginLeft: 0 }}>
              <Skeleton width={250} height={20} />
            </div>

            <div style={{ marginTop: 5, marginLeft: 0 }}>
              <Skeleton width={90} height={30} />
            </div>
          </div>
        </div>
        {/* <h3 style={{ marginTop: 30 }}>
          <Skeleton height={28} width={250} />
        </h3>
         */}
      </div>
    </div>
  );
};

export default SlashCategoryGamesIdLoadingHeader;
