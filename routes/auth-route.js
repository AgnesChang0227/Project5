import express, {raw} from "express";
const router = express.Router();
import passport from "passport";
import User from "../models/user-model.js";
import bcrypt from "bcrypt";

router.get("/login", (req, res) => {
    res.render("login",{user:req.user});
})

router.get("/logout",(req, res)=>{
    req.logOut();//passport提供的方法=>logout
    res.redirect("/");//導回首頁
})

router.get("/signup",(req,res)=>{
    res.render("signup",{user:req.user});
})

router.post("/signup",async (req,res)=>{
    let {name,email,password}=req.body;
    //check if the data is already exist
    const emailExist = await User.findOne({email});
    //status 400 ,send
    if (emailExist) return res.status(400).send("Email already exist")
    const hash = await bcrypt.hash(password,10);
    password=hash;
    try{
        const savedUser= await new User({name,email,password}).save();
        res.status(200).send({
            msg:"User saved",
            saveObj:savedUser,
        })
    }catch (err){
        res.status(400).send(err);
    }
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
