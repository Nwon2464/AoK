import React from "react";
import { Link } from "react-router-dom";
export const genRand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const checkViewers = (views) => {
  if (views <= 999) {
    return <>{`${views} Viewers`}</>;
  } else if (views < 999999) {
    return (
      <>{`${
        Math.sign(views) * (Math.abs(views) / 1000).toFixed(1)
      }K Viewers`}</>
    );
  } else if (views <= 9999999) {
    return (
      <>{`${
        Math.sign(views) * (Math.abs(views) / 1000000).toFixed(1)
      }M Viewers`}</>
    );
  }
};
export const checkFollowers = (number) => {
  const formatNumber = (num) => {
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
  };

  if (number < 1000) {
    return `${number} followers`;
  } else if (number >= 1000 && number < 1000000) {
    return `${formatNumber(number / 1000)}K followers`;
  } else if (number >= 1000000 && number < 1000000000) {
    return `${formatNumber(number / 1000000)}M followers`;
  } else if (number >= 1000000000) {
    return `${formatNumber(number / 1000000000)}B followers`;
  }
}
export const checkTags = (streams, i) => {
  return streams.tags.map((e, i) => {
    return (
      <Link
        className="channel__tag__anchor"
        key={i}
        style={{ marginLeft: 2, maxWidth: 90 }}
        to={`/category/all/tags/${e}`}
      >
        {e}
      </Link>
    );
  });
};
