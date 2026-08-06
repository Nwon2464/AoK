const authService = require("../services/authService");
const {
    languagePreferenceSchema,
    loginSchema,
    signUpSchema,
    validate,
} = require("../auth/validation");
const SignupUser = require("../models/signup");
const { createHttpError } = require("../utils/httpError");

const validateRequest = (schema, body) => {
    const { error, value } = validate(schema, body);

    if (error) {
        throw createHttpError(400, error.details[0].message, "VALIDATION_ERROR");
    }

    return value;
};

const signUp = async (req, res, next) => {
    try {
        const input = validateRequest(signUpSchema, req.body);
        const authResult = await authService.signUp(input);

        res.status(201).json(authResult);
    } catch (error) {
        next(error);
    }
};

const logIn = async (req, res, next) => {
    try {
        const input = validateRequest(loginSchema, req.body);
        const authResult = await authService.logIn(input);

        res.json(authResult);
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await SignupUser.findById(req.user._id);
        if (!user) {
            throw createHttpError(404, "User account not found", "USER_NOT_FOUND");
        }

        res.json({ user: authService.toPublicUser(user) });
    } catch (error) {
        next(error);
    }
};

const updateLanguage = async (req, res, next) => {
    try {
        const { language } = validateRequest(languagePreferenceSchema, req.body);
        const user = await SignupUser.findByIdAndUpdate(
            req.user._id,
            { language },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw createHttpError(404, "User account not found", "USER_NOT_FOUND");
        }

        res.json({ language: user.language });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMe,
    logIn,
    signUp,
    updateLanguage,
};
