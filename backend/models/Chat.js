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

let Chat=mongoose.model("ChatSchema",chatSchema);
module.exports=Chat;