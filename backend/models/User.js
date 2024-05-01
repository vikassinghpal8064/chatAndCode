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
      autopopulate:true
    },
    phone: {
      type: String,
    },
    groups: [{ type: mongoose.Types.ObjectId, ref: "Group",
    // autopopulate:true 
  }],

    posts: [{ type: mongoose.Types.ObjectId, ref: "Post",
    // autopopulate:true
   }],

    friends: [{ type: mongoose.Types.ObjectId, ref: "Friend",
    // autopopulate:true 
  }],

    notifications: [{post:{
      type:mongoose.Types.ObjectId,
      ref:"Post"
    },
    friend:{
      type:mongoose.Types.ObjectId,
      ref:"Friend"
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
