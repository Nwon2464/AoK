module.exports = {
    // other webpack configurations...
    resolve: {
        fallback: {
            "zlib": false,
            "http":false,
        }
    }
};
