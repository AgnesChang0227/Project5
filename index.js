import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import authRoute from "./routes/auth-route.js";
import profileRoute from "./routes/profileRoute.js";
import "./config/passport.js";
import cookieSession from "cookie-session";
import passport from "passport";

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
app.use(cookieSession({
    keys:[process.env.SECRET],
}))
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

