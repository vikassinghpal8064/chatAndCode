const mongoose = require("mongoose");

let groupSchema=new  mongoose.Schema({
    friendId:[{
        type:mongoose.Types.ObjectId,
        ref:"Friend",
        // autopopulate:true
    }]
},{timestamps:true})

// groupSchema.plugin(require("mongoose-autopopulate"));
let Group= model.Schema("Group",groupSchema);
module.exports=Group;