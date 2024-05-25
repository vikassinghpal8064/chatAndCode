const mongoose= require("mongoose");

const chatSchema=new  mongoose.Schema({
    sourceId:{
        type:String,
        required:true
    },
    targetId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        trim:true,

    }
},{timestamps:true})

let Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;