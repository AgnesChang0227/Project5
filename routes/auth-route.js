import express from "express";
const router = express.Router();
import passport from "passport";
import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import e from "express";

router.get("/login", (req, res) => {
    res.render("login",{user:req.user});
})
router.post("/login",passport.authenticate("local",{
    failureRedirect:"/auth/login",
    failureFlash:"Wrong email or password.",
}),(req,res)=>{
    if (req.session.returnTo){
        let newPath = req.session.returnTo;
        req.session.returnTo="";
        res.redirect(newPath);
    }else {
        res.redirect("profile");
    }
    }
)

router.get("/logout",(req, res)=>{
    req.logOut();//passport提供的方法=>logout
    res.redirect("/");//導回首頁
})

router.get("/signup",(req,res)=>{
    res.render("signup",{user:req.user});
})
router.post("/signup",(req,res)=>{
    let {name,email,password}=req.body;
    //check if the data is already exist
    User.findOne({email}).then(async (user) => {
        if (user) {
            req.flash("error_msg", "Email has already been registered.");
            res.redirect("/auth/signup");
        } else {
            password = bcrypt.hashSync(password,10);
            let newUser = new User({name, email, password});
            try {
                await newUser.save();
                req.flash("success_msg", "Registration succeed. You can login now.");
                res.redirect("/auth/login");
            } catch (err) {
                req.flash("error_msg",err.errors.name.properties.message);
                res.redirect("/auth/signup");
            }
        }
    })
})


// router.get("/google",
//     //這邊是一個middleware, 當運行到/google，則查看passport 是否有GoogleStrategy
//     passport.authenticate("google", {
//         scope: ["profile"],
//     })
// );
//如果希望使用者每次登入時，可以選擇登入的帳號：
router.get("/google",//這邊可能要加個catch err
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
    if (req.session.returnTo){
        let newPath = req.session.returnTo;
        req.session.returnTo="";
        res.redirect(newPath);
    }else {
        res.redirect("profile");
    }
})
export default router;
