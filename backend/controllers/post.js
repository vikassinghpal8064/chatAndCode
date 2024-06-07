const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { validateUser } = require("../middleware/postMiddleware");
//add new post
router.get("/addPost", validateUser, async (req, res) => {
  try {
    let userId = req.user.id;
    console.log(req.user);
    console.log(userId);
    let user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    let { title, upload, description: desc } = req.body;
    let newPost = await Post.create({ userId, title, upload, desc });
    console.log(newPost);
    await newPost.save();
    await user.posts.push(newPost);
    await user.save();
    res.status(201).send({ message: "successfully added you post" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// find all post of te user
router.get("/allPosts", async (req, res) => {
  try {
    let posts = await Post.find({});
    res.status(200).send({ posts: posts });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// delete post
router.delete("/deletePost/:id", validateUser, async (req, res) => {
  try {
    let { id } = req.params;
    let deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).send({ message: "post is not found" });
    } else {
      let userId = deleted.userId.toString();
      let user = await User.findById(userId);
      let index = user.posts.indexOf(id);
      await User.updateOne(
        { _id: userId },
        { $pull: { posts: user.posts[index] } }
      );
      user.save();

      res.status(201).send({ message: "successfully deleted post" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//like post
router.get("/like/post/:id",validateUser,async(req,res)=>{
 try{
  
    let { id } = req.params;
    let userId = req.user.id;
    
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    let person = await User.findById(userId);
    if (!person) {
      return res.status(404).send({ message: "User not found" });
    }
    let newObj={
        likedBy:person._id,
        likedOrDisliked:1

    }
    post.likes.push(newObj);
    await post.save();

    res.status(202).send({"message":"post liked successfully"})


 }
 catch(err){
    res.status(500).send({"message":err.message})
 }
})

//comment on post
router.post("/comment/:id", validateUser, async (req, res) => {
    try {
      let { comment } = req.body;
      let { id } = req.params;
      let userId = req.user.id;
      
      let post = await Post.findById(id);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
  
      let commentedUser = await User.findById(userId);
      if (!commentedUser) {
        return res.status(404).send({ message: "User not found" });
      }
  
      let newObj = { commentedBy: commentedUser._id, comment: comment };
      post.comments.push(newObj);
      await post.save();
  
      res.status(202).send({ message: "Comment is added" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
  

module.exports = router;
