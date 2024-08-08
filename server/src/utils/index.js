const replaceThumbnailSize = (url, width, height) => {
    return url.replace("{width}", width).replace("{height}", height);
};

module.exports = replaceThumbnailSize;