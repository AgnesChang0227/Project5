import express from "express"
const router = express.Router();
import Post from "../models/post-model.js";

//middleware
const authCheck = (req,res,next)=>{
    console.log(req.originalUrl);//原本要去的位置
    // req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()){//如果沒有被認證(登入)
        req.session.returnTo = req.originalUrl;
        res.redirect("/auth/login")//就自動導向去login page
    }else next();
}

//如果已登入，就導向profile page
router.get("/",authCheck,async (req,res)=>{
    let postFound = await Post.find({author:req.user.id})
    res.render("profile",{user:req.user,posts:postFound});
})

router.get("/post",authCheck,(req,res)=>{
    res.render("post",{user:req.user});
})
router.post("/post",authCheck,async (req,res)=>{
    let {title,content}= req.body;
    let newPost = new Post({title,content,author:req.user._id});
    try{
        await newPost.save();
        res.status(200).redirect("/profile");
    }catch (err){
        req.flash("error_msg","Posting fail");
        res.redirect("/profile/post");
    }
})

export default router;