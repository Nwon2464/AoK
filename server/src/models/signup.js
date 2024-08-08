const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const signupSchema = new Schema({
    // _id: String,
    username : {type : String, required : true},
    password : {type : String, required : true},
    email : {type : String, required : true},
    dateofbirth : String,
    month : Number,
    year : Number,
});

const signupUsers = mongoose.model("signupUsers", signupSchema);

module.exports = signupUsers;
