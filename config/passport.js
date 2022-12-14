import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/user-model.js";
import LocalStrategy from "passport-local"
import bcrypt from "bcryptjs";
import e from "express";

//創建一個cookie => serialize UserID
passport.serializeUser((user, done) => {
    console.log("Serializing user now");
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    console.log("Deserializing user now ");
    User.findById({_id}).then((user) => {
        console.log("found user");
        done(null, user);
    })
})
//本地帳戶login 用到passport-local
passport.use(new LocalStrategy( (username, password, done) => {
    console.log(username, password);
    User.findOne({email: username})
        .then(async user => {
            if (!user) {
                return done(null, false);
            } else {
                await bcrypt.compare(password, user.password, (err, result) => {
                    if (!result||err) {
                        return done(null, false)
                    }else {
                        return done(null, user);
                    }
                });
            }
        }).catch(err=>{
            return done(null,false);
    })
}))

passport.use(new GoogleStrategy({//檢查
        clientID: "746570348159-amsb83ddgqq4sh57cracdfs7iom8730m.apps.googleusercontent.com",
        clientSecret: "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", //將這個url填寫到創建用戶端ID的重新導向URI
        callbackURL: "/auth/google/redirect",
    },//成功則進行以下callback fn
    (accessToken, refreshToken, profile, done) => {//passport callback
        console.log(profile);
        User.findOne({googleID: profile.id})
            .then((foundUser) => {
                if (foundUser) {
                    console.log("User already exist");
                    done(null, foundUser);
                } else {
                    new User({
                        name: profile.displayName,
                        googleID: profile.id,
                        thumbnail: profile.photos[0].value,
                        email: profile.emails[0].value,
                    }).save().then((newUser) => {
                        console.log("new user created");
                        done(null, newUser);
                    })
                }
            })
    }))


