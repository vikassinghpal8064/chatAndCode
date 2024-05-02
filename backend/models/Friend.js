const mongoose = require("mongoose");

let friendSchema=new  mongoose.Schema({

        sourceId:{
           
            type:String,
            required:true,
        
    },
      targetId:{
    type:String,
    required:true,
    
  
    
 },

 status:{
   type:Boolean,
   dafault:false,
 },
 

},{timestamps:true})
// friendSchema.plugin(require('mongoose-autopopulate'));
let Friend= mongoose.model("Friend",friendSchema);
module.exports=Friend;