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
      ref:"ChatSchema"}],
    },
  { timestamps: true }
);
// friendSchema.plugin(require('mongoose-autopopulate'));
let Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
