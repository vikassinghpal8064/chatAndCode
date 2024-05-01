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
  
    
 },

 status:{
   type:Boolean,
   dafault:false,
 },
 
 post:{
   type:mongoose.Types.ObjectId,
   ref:"Post"
 }
},{timestamps:true})
// friendSchema.plugin(require('mongoose-autopopulate'));
let Friend= mongoose.model("Friend",friendSchema);
module.exports=Friend;