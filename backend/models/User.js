const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
    },
    useName: {
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
      type: Number,
    },
    group: [{ type: mongoose.Types.ObjectId, ref: "Group",
    // autopopulate:true 
  }],

    post: [{ type: mongoose.Types.ObjectId, ref: "Post",
    // autopopulate:true
   }],

    friend: [{ type: mongoose.Types.ObjectId, ref: "Friend",
    // autopopulate:true 
  }],

    notification: [{ type: mongoose.Types.ObjectId, ref: "Notification",
    // autopopulate:true 
  }],
  },
  { timestamps: true }
);
// userSchema.plugin(require("mongoose-autopopulate"));
let User = mongoose.model("User", userSchema);
module.exports = User;
