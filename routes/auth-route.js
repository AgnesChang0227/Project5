import express from "express";
const router = express.Router();
import passport from "passport";

router.get("/login", (req, res) => {
    res.render("login",{user:req.user});
})

router.get("/logout",(req, res)=>{
    req.logOut();//passport提供的方法=>logout
    res.redirect("/");//導回首頁

})

// router.get("/google",
//     //這邊是一個middleware, 當運行到/google，則查看passport 是否有GoogleStrategy
//     passport.authenticate("google", {
//         scope: ["profile"],
//     })
// );
//如果希望使用者每次登入時，可以選擇登入的帳號：
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.redirect("/profile")
})
export default router;
