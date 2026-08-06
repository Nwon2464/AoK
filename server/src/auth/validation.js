const Joi = require("joi");
const { supportedLanguages } = require("../models/signup");

const passwordSchema = Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required();

const signUpSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: passwordSchema,
    email: Joi.string().email().lowercase().required(),
    dateofbirth: Joi.string().alphanum().empty("").optional(),
    month: Joi.number().integer().min(1).max(12).empty("").optional(),
    year: Joi.number().integer().min(1900).max(2013).empty("").optional(),
});

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: passwordSchema,
});

const languagePreferenceSchema = Joi.object({
    language: Joi.string().valid(...supportedLanguages).required(),
});

const validate = (schema, input) => schema.validate(input, {
    abortEarly: false,
    stripUnknown: true,
});

module.exports = {
    loginSchema,
    languagePreferenceSchema,
    signUpSchema,
    validate,
};
