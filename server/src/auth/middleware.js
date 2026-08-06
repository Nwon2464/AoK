const jwt = require("jsonwebtoken");

const { createHttpError } = require("../utils/httpError");

const getBearerToken = (req) => {
    const authHeader = req.get("authorization");

    if (!authHeader) {
        return null;
    }

    const [scheme, token] = authHeader.split(" ");
    return scheme === "Bearer" && token ? token : null;
};

const checkTokenSetUser = (req, res, next) => {
    const token = getBearerToken(req);

    if (!token) {
        next();
        return;
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        req.user = undefined;
    }

    next();
};

const requireJwt = (req, res, next) => {
    const token = getBearerToken(req);

    if (!token) {
        next(createHttpError(401, "Authentication required", "AUTH_REQUIRED"));
        return;
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(createHttpError(401, "Invalid or expired token", "INVALID_TOKEN"));
    }
};

module.exports = {
    checkTokenSetUser,
    requireJwt,
};
