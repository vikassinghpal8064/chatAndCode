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
      dafault: false,
    },

    chats:[{type:mongoose.SchemaTypes.ObjectId,
      ref:"Chat"}],
    },
  { timestamps: true }
);

let Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
