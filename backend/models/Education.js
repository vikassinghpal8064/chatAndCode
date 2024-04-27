const mongoose= require('mongoose');

let educationSchema= new mongoose.Schema({
    school:{
        name:{type:String,trim:true},
        class:{type:Number},
        year:{type:Number},
    },
    college:{
        name:{type:String,trim:true},
        year:{type:Number},
        class:{type:String,trim:true}
    }
},{timestamps:true})

let Education=mongoose.model("Education",educationSchema);
module.exports=Education;