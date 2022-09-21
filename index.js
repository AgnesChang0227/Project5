import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/auth-route.js";
import "./config/passport.js";

mongoose.connect(process.env.DB_CONNECT,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connect to mongodb atlas");
}).catch(err=>{
    console.log(err);
});

//middleware
app.set("view engine","ejs");
app.use(express.json());//express 裡面包括了body-parser
app.use(express.urlencoded({extended:true}));
app.use("/auth",authRoute);//get"/auth" 就進入authRoute

app.get("/",(req,res)=>{
    res.render("index");
})

app.listen(5080,()=>{
    console.log("Server running on port 5080");
})

