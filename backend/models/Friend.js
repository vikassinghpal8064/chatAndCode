const mongoose = require("mongoose");

let friendSchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: false,
    },

    chats:[{type:mongoose.Types.ObjectId,
      ref:"Chat"}],
    },
  { timestamps: true }
);

let Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
