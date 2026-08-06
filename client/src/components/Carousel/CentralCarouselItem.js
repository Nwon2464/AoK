import React, { useEffect, useState, memo } from "react";
import CarouselBody from "./CarouselBody";

const CentralCarouselItem = ({ streams, AutoCard, delayMs = 5000 }) => {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // 중앙(또는 채널)이 바뀔 때마다 x초 대기
    setShowVideo(false);
    const t = setTimeout(() => setShowVideo(true), delayMs);
    return () => clearTimeout(t);
  }, [streams?.user_name, delayMs]);

  if (!showVideo) {
    return (
      <img
        src={streams.thumbnail_url.replace("440x248", "800x248")}
        alt={`${streams.user_name} thumbnail`}
        className="carousel-thumbnail"
      />
    );
  }

  const parent = window.location.hostname;
  const playerUrl = `https://player.twitch.tv/?channel=${encodeURIComponent(streams.user_login)}&muted=true&parent=${encodeURIComponent(parent)}`;

  return (
    <div className="carousel-central-content">
      <iframe
        title={`twitch-${streams.user_name}`}
        className="app__iframe app__order__1"
        src={playerUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <CarouselBody streams={streams} autoCard={AutoCard} />
    </div>
  );
};

export default memo(CentralCarouselItem);
