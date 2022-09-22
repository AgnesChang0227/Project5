import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import authRoute from "./routes/auth-route.js";
import profileRoute from "./routes/profileRoute.js";
import "./config/passport.js";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";

mongoose.connect("mongodb://localhost:27017/myDatabase",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connect to mongodb atlas");
}).catch(err=>{
    console.log(err);
});

//middleware
app.use(express.static("public"))
app.set("view engine","ejs");
app.use(express.json());//express 裡面包括了body-parser
app.use(express.urlencoded({extended:true}));
//順序: session => passport => flash
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
}));
app.use(flash());
app.use((req,res,next)=>{
    //賦值後，success_msg可以在views中都會被偵測到
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})
app.use(passport.initialize());
app.use(passport.session());


app.get("/",(req,res)=>{
    res.render("index",{user:req.user});
})
app.use("/auth",authRoute);//get"/auth" 就進入authRoute
app.use("/profile",profileRoute);

app.listen(5080,()=>{
    console.log("Server running on port 5080");
})

