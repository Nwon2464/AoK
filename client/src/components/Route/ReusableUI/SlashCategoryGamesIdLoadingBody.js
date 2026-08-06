import React from "react";
import Skeleton from "react-loading-skeleton";

const skeletonStyle = {
  backgroundColor: "var(--theme-control)",
  backgroundImage: "none",
};

const SlashCategoryGamesIdLoadingBody = () => {
  return (
    <div
      className="category-page-skeleton-grid"
      aria-busy="true"
      aria-label="Loading live channels"
    >
      <div className="card__display__flex__wrap">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="app__tower__300 app-pd-r-02">
            <article className="card__display__flex__direction category-page-stream-skeleton">
              <div className="app__width app__order__2 app__margin__top">
                <div className="app__flex__nowrap app__flex">
                  <div className="channel__icon">
                    <Skeleton circle width={40} height={40} style={skeletonStyle} />
                  </div>
                  <div className="category-page-stream-skeleton-copy">
                    <Skeleton width="92%" height={18} style={skeletonStyle} />
                    <Skeleton width="55%" height={14} style={skeletonStyle} />
                    <Skeleton width="42%" height={18} style={skeletonStyle} />
                  </div>
                </div>
              </div>
              <div className="app__order__1 category-page-thumbnail-skeleton">
                <Skeleton width="100%" height="100%" style={skeletonStyle} />
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlashCategoryGamesIdLoadingBody;
