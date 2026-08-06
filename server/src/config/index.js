const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authService = require("../services/authService");

const isGoogleAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (isGoogleAuthConfigured) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
            || "http://localhost:5000/auth/google/redirect",
        proxy: true,
        state: true,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            done(null, await authService.logInWithGoogle(profile));
        } catch (error) {
            done(error);
        }
    }));
}

module.exports = {
    isGoogleAuthConfigured,
};
