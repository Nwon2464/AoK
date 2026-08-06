const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api/v1/*", "/api/v2/*", "/auth/*", "/streams"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};
