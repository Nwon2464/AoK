const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SignupUser = require("../models/signup");
const { createHttpError } = require("../utils/httpError");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "7d";

const toPublicUser = (user) => ({
    id: String(user._id),
    username: user.username,
    email: user.email,
    profileImage: user.profileImage || null,
    language: user.language || null,
});

const createToken = (user) => jwt.sign(
    {
        _id: user._id,
        username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
);

const duplicateField = (error) => (
    Object.keys(error.keyPattern || error.keyValue || {})[0]
);

const duplicateUserError = (field = "username") => {
    if (field === "email") {
        return createHttpError(409, "This email is already registered.", "EMAIL_TAKEN");
    }

    return createHttpError(
        409,
        "This username is unavailable. Try others!",
        "USERNAME_TAKEN"
    );
};

const signUp = async (input) => {
    const existingUser = await SignupUser.findOne({
        $or: [
            { username: input.username },
            { email: input.email },
        ],
    });

    if (existingUser) {
        throw duplicateUserError(
            existingUser.email === input.email ? "email" : "username"
        );
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    try {
        const user = await SignupUser.create({
            ...input,
            password: hashedPassword,
        });

        return {
            token: createToken(user),
            user: toPublicUser(user),
        };
    } catch (error) {
        if (error?.code === 11000) {
            throw duplicateUserError(duplicateField(error));
        }

        throw error;
    }
};

const logIn = async ({ username, password }) => {
    const user = await SignupUser.findOne({ username }).select("+password");

    if (!user || !user.password) {
        throw createHttpError(401, "Unable to login", "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw createHttpError(401, "Unable to login", "INVALID_CREDENTIALS");
    }

    return {
        token: createToken(user),
        user: toPublicUser(user),
    };
};

const createGoogleUsername = async (profile, email) => {
    const source = profile.displayName || email.split("@")[0] || "user";
    let base = source.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (base.length < 3) {
        base = `user${base}`;
    }
    base = base.slice(0, 24);

    let candidate = base;
    let suffix = 0;
    while (await SignupUser.exists({ username: candidate })) {
        suffix += 1;
        const suffixText = String(suffix);
        candidate = `${base.slice(0, 30 - suffixText.length)}${suffixText}`;
    }

    return candidate;
};

const logInWithGoogle = async (profile) => {
    const email = (
        profile.emails?.find(({ value }) => Boolean(value))?.value
        || profile._json?.email
        || ""
    ).trim().toLowerCase();

    if (!email || profile._json?.email_verified === false) {
        throw createHttpError(
            400,
            "Google did not provide a verified email address.",
            "GOOGLE_EMAIL_REQUIRED"
        );
    }

    const profileImage = profile.photos?.[0]?.value || profile._json?.picture || null;
    let user = await SignupUser.findOne({
        $or: [{ googleId: profile.id }, { email }],
    });

    if (user) {
        user.googleId = profile.id;
        if (profileImage) user.profileImage = profileImage;
        await user.save();
        return user;
    }

    const username = await createGoogleUsername(profile, email);
    try {
        user = await SignupUser.create({
            username,
            email,
            googleId: profile.id,
            profileImage,
        });
        return user;
    } catch (error) {
        if (error?.code === 11000) {
            const existingUser = await SignupUser.findOne({
                $or: [{ googleId: profile.id }, { email }],
            });
            if (existingUser) return existingUser;
        }
        throw error;
    }
};

module.exports = {
    createToken,
    logIn,
    logInWithGoogle,
    signUp,
    toPublicUser,
};
