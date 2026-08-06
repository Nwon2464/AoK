const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const supportedLanguages = ["en", "da", "en-GB", "es-ES", "zh-CN", "ja", "ko"];

const signupSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: String,
    dateofbirth: String,
    month: Number,
    year: Number,
    language: { type: String, enum: supportedLanguages },
}, { timestamps: true });

const signupUsers = mongoose.model("signupUsers", signupSchema);

module.exports = signupUsers;
module.exports.supportedLanguages = supportedLanguages;
