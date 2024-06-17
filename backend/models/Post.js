const mongoose = require("mongoose");

let postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // autopopulate:true
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    upload: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
      required: true,
    },
    comments: [{
        commentedBy:{type:mongoose.Types.ObjectId,ref:"User"},
        comment:{type: String,
            trim: true,}
      }],
    likes: [{
        likedBy:{type:mongoose.Types.ObjectId,ref:"User"},
       
    }],
    dislikes: [{
      dislikedBy:{type:mongoose.Types.ObjectId,ref:"User"},
     
  }]
  },
  { timestamps: true }
);
// postSchema.plugin(require("mongoose-autopopulate"))
let Post = mongoose.model("Post", postSchema);
module.exports = Post;
