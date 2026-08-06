import React from "react";
import Skeleton from "react-loading-skeleton";

const skeletonStyle = {
  backgroundColor: "var(--theme-control)",
  backgroundImage: "none",
};

const SlashCategoryGamesIdLoadingHeader = () => {
  return (
    <section
      className="category-page-banner category-page-banner-loading"
      aria-busy="true"
      aria-label="Loading category information"
    >
      <Skeleton className="category-page-cover-skeleton" style={skeletonStyle} />
      <div className="category-page-summary category-page-summary-loading">
        <Skeleton width={220} height={38} style={skeletonStyle} />
        <Skeleton width={140} height={20} style={skeletonStyle} />
        <Skeleton width={190} height={14} style={skeletonStyle} />
      </div>
    </section>
  );
};

export default SlashCategoryGamesIdLoadingHeader;
