import express from "express"
const router = express.Router();

//middleware
const authCheck = (req,res,next)=>{
    console.log(req.user)
    if (!req.isAuthenticated()){//如果沒有被認證(登入)
        res.redirect("/auth/login")//就自動導向去login page
    }else next();
}

//如果已登入，就導向profile page
router.get("/",authCheck,(req,res)=>{
    res.render("profile",{user:req.user});
})

export default router;