require("dotenv").config();

const passport = require("passport");
const router = require("express").Router();

const authController = require("../controllers/authController");
const authService = require("../services/authService");
const { isGoogleAuthConfigured } = require("../config");
const { requireJwt } = require("./middleware");
const { createHttpError } = require("../utils/httpError");

const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/+$/, "");

const requireGoogleConfiguration = (req, res, next) => {
    if (!isGoogleAuthConfigured) {
        next(createHttpError(
            503,
            "Google login is not configured.",
            "GOOGLE_AUTH_NOT_CONFIGURED"
        ));
        return false;
    }
    return true;
};

router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);
router.get("/me", requireJwt, authController.getMe);
router.patch("/preferences/language", requireJwt, authController.updateLanguage);

router.get("/google", (req, res, next) => {
    if (!requireGoogleConfiguration(req, res, next)) return;

    passport.authenticate("google", {
        scope: ["openid", "email", "profile"],
        session: false,
    })(req, res, next);
});

router.get("/google/redirect", (req, res, next) => {
    if (!requireGoogleConfiguration(req, res, next)) return;

    passport.authenticate("google", { session: false }, (error, user) => {
        if (error || !user) {
            res.redirect(`${clientUrl}/auth/google/callback?error=google_auth_failed`);
            return;
        }

        const token = authService.createToken(user);
        res.redirect(
            `${clientUrl}/auth/google/callback#token=${encodeURIComponent(token)}`
        );
    })(req, res, next);
});

module.exports = router;
