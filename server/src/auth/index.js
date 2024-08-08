require('dotenv').config();
const passport = require("passport");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const signupUsers = require("../models/signup");

const signUpSchema = Joi.object({
    username : Joi.string().alphanum().min(3).max(30).required(),
    password : Joi.string().trim().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
    email : Joi.string().email().required(),
    dateofbirth : Joi.string().alphanum(),
    month : Joi.number().integer().min(1).max(12),
    year : Joi.number().integer().min(1900).max(2013),
});

const loginSchema = Joi.object({
    username : Joi.string().alphanum().min(3).max(30).required(),
    password : Joi.string().trim().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
});
const createTokenSendResponse = (user, res, next) => {
    const payload = {
        _id : user._id,
        username : user.username,
    };
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : "7d",
    },
             (error, token) => {
                 if (error) {
                     respondErrorToken422(res, next);
                 } else {
                     res.json({token, user});
                 }
             });
};

router.get("/signup", (req, res) => { res.json({msg : "AA"}); });

router.post("/signup", async (req, res, next) => {
    const result = signUpSchema.validate({
        username : req.body.username,
        password : req.body.password,
        email : req.body.email,
    });
    if (result.error === undefined) {
        signupUsers
            .findOne({
                username : req.body.username,
            })
            .then((user) => {
                if (user) {
                    console.log("user=>", user);
                    const error = new Error("This username is unavailable. Try others!");
                    next(error);
                } else {
                    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
                        const newUser = {
                            username : req.body.username,
                            password : hashedPassword,
                            email : req.body.email,
                            dateofbirth : req.body.dateofbirth,
                            month : req.body.month,
                            year : req.body.year,
                        };
                        new signupUsers(newUser).save().then((completedNewUser) => {
                            createTokenSendResponse(completedNewUser, res, next);
                            // completedNewUser.password = "your password is secured";
                            // res.json(completedNewUser);
                        });
                    });
                }
            });
    } else {
        console.log("you reached error");
        next(result.error);
    }
});
const respondError422 = (res, next) => {
    res.status(422);
    const error = new Error("Unable to login");
    next(error);
};
const respondErrorUnmatched401 = (res, next) => {
    res.status(401);
    const error = new Error("Unmatched password");
    next(error);
};
const respondErrorToken422 = (res, next) => {
    res.status(422);
    const error = new Error("JWT Token generator error");
    next(error);
};
router.post("/login", (req, res, next) => {
    const result = loginSchema.validate({
        username : req.body.username,
        password : req.body.password,
    });
    console.log(result.error);
    if (result.error === undefined) {
        signupUsers
            .findOne({
                username : req.body.username,
            })
            .then((user) => {
                if (user) {
                    bcrypt.compare(req.body.password, user.password).then((result) => {
                        if (result) {
                            // they send us right password
                            createTokenSendResponse(user, res, next);
                        } else {
                            // they send us wrong password
                            respondErrorUnmatched401(res, next);
                        }
                    });
                } else {
                    respondError422(res, next);
                }
            });
    } else {
        respondError422(res, next);
    }
});
router.get("/current_user", (req, res) => {
    res.json(req.user);
});

// router.get("/current_user",(req,res)=>{
//     console.log(req.user, "----------",req.cookies);
//     const token = req.cookies.jwt;
//     if (!token) {
//       return res.status(401).send('Access Denied');
//     }
//     try {

//       const verified = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = verified;
//       console.log(req.user,token);
//       console.log( "from current user");

//       res.send(req.user);
//     } catch (err) {
//       res.status(400).send('Invalid Token');
//     }
// });

// auth logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/google", passport.authenticate("google", {
    scope : [ "email", "profile" ],
}));

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/");
});

module.exports = router;
