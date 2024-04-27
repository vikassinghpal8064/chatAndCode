const mongoose = require("mongoose");

let friendSchema=new  mongoose.Schema({

        source:{
           
            type:mongoose.Types.ObjectId,
            ref:"User",
            // autopopulate:true,
        
    },
 target:{
   
    type:mongoose.Types.ObjectId,
    ref:"User",
   //  autopopulate:true,
    
 }
},{timestamps:true})
// friendSchema.plugin(require('mongoose-autopopulate'));
let Friend= model.Schema("Friend",friendSchema);
module.exports=Friend;