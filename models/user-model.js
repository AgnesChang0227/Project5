import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    googleID: {
        type: String,
    }
    ,
    date: {
        type: Date,
        default: Date.now,
    },
    thumbnail: {//縮圖，在google上儲存的照片 => 網址
        type: String,
    },
    //local login 使用的
    email:{
        type:String,
    },
    password:{
        type:String,
        maxlength:1024,//要預計hash過後的長度
    }
})

export default mongoose.model("User",userSchema);