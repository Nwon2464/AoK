function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode);
  const response = {
    message: err.message,
    ...(err.code ? { code: err.code } : {}),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  };
  res.json(response);
}

module.exports = {
  notFound,
  errorHandler,
};
