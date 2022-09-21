import express from "express";
const router = express.Router();
import passport from "passport";

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/google",
    //這邊是一個middleware, 當運行到/google，則查看passport 是否有GoogleStrategy
    passport.authenticate("google", {
        scope: ["profile"],
    })
);

router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.redirect("/profile")
})
export default router;