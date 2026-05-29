const replaceThumbnailSize = require("../utils");

const withBoxArtSize = (game, width = 285, height = 385) => ({
    ...game,
    box_art_url: replaceThumbnailSize(game.box_art_url, width, height),
});

const withStreamThumbnailSize = (stream, width = 440, height = 248) => ({
    ...stream,
    thumbnail_url: replaceThumbnailSize(stream.thumbnail_url, width, height),
});

const withProfileImage = (stream, user, fieldName = "profile_image_url") => ({
    ...stream,
    [fieldName]: user?.profile_image_url,
});

const withTopStreamerInfo = (stream, user) => ({
    ...withStreamThumbnailSize(stream),
    ...(user
        ? {
            profile_image_url: replaceThumbnailSize(user.profile_image_url, 300, 300),
            description: user.description,
        }
        : {}),
});

module.exports = {
    withBoxArtSize,
    withStreamThumbnailSize,
    withProfileImage,
    withTopStreamerInfo,
};
