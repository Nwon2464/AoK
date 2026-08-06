import React from "react";

const SlashIdHeader = ({ channel }) => {
  const { liveStream, user } = channel;

  if (liveStream) {
    const parent = window.location.hostname;
    const playerUrl = `https://player.twitch.tv/?channel=${encodeURIComponent(user.login)}&muted=true&parent=${encodeURIComponent(parent)}`;

    return (
      <div className="channel-player-frame">
        <iframe
          title={`${user.displayName} live stream`}
          src={playerUrl}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="channel-player-frame channel-offline-frame">
      {user.offlineImageUrl && (
        <img src={user.offlineImageUrl} alt={`${user.displayName} offline`} />
      )}
    </div>
  );
};

export default SlashIdHeader;
