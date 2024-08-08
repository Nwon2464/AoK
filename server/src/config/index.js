const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/user");

passport.serializeUser((user, done) => { done(null, user.id); });

// // // browser sends the cookie back and received the id
passport.deserializeUser((id, done) => { Users.findById(id).then((user) => { done(null, user); }); });
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : "/auth/google/redirect",
    proxy:true,
},
                                (accessToken, refreshToken, profile, done) => {
                                    // console.log(profile);
                                    //   return null;
                                    // console.log(profile);
                                    try {
                                        Users
                                            .findOne({
                                                googleId : profile.id,
                                            })
                                            .then((currentUser) => {
                                                if (currentUser) {
                                                    // already have user
                                                    console.log("already have user");
                                                    done(null, currentUser);
                                                } else {
                                                    // if not, create user in our db
                                                    new Users({
                                                        googleId : profile.id,
                                                        googleImage : profile._json.picture,
                                                        displayName : profile.displayName,
                                                        googleEmail : profile._json.email,
                                                    })
                                                        .save()
                                                        .then((newUser) => {
                                                            console.log("New data saved in MONGODB", newUser);
                                                            done(null, newUser);
                                                        });
                                                }
                                            });
                                    } catch (error) {
                                        throw new Error();
                                    }
                                }));
