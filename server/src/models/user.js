const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // _id: String,
    googleId : String,
    googleImage : String,
    displayName : String,
    googleEmail : String,
});

const Users = mongoose.model("users", userSchema);

module.exports = Users;
