import React from "react";

import Skeleton from "react-loading-skeleton";

const SlashCategoryAllLoading = ({ count = 15 }) => {
  return (
    <div className="browse-grid browse-loading-grid" aria-label="Loading categories">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="browse-card">
          <div className="browse-skeleton-image">
            <Skeleton
              height="100%"
              style={{ backgroundImage: "none", backgroundColor: "var(--theme-control)" }}
            />
          </div>
          <Skeleton
            width="80%"
            height={20}
            style={{ backgroundImage: "none", backgroundColor: "var(--theme-control)" }}
          />
        </div>
      ))}
    </div>
  );
};

export default SlashCategoryAllLoading;
