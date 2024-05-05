const mongoose = require("mongoose");
const Friend = require("./Friend");

let userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: mongoose.Types.ObjectId,
      ref: "Education",
     
    },
    phone: {
      type: String,
    },
    groups: [{ type: mongoose.Types.ObjectId, ref: "Group",
 
  }],

    posts: [{ type: mongoose.Types.ObjectId, ref: "Post",

   }],

    friends: [{ type: mongoose.Types.ObjectId, ref: "Friend",
 
  }],

    notifications: [{
    friend:{
      type:mongoose.Types.ObjectId,
      ref:"Friend"
    },
   category:{
    
       type:String,
       trim:true,
    },
    message:{
      type:String,
      trim:true,
    }
  }],
  },
  { timestamps: true }
);
// userSchema.plugin(require("mongoose-autopopulate"));
let User = mongoose.model("User", userSchema);
module.exports = User;
