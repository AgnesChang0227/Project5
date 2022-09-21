import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {//檢查
            clientID:"746570348159-amsb83ddgqq4sh57cracdfs7iom8730m.apps.googleusercontent.com",
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            //將這個url填寫到創建用戶端ID的重新導向URI
            callbackURL: "/auth/google/redirect",
        },//成功則進行以下callback fn
        () => {//passport callback

        }
    ))


