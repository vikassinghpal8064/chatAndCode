const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { validateUser } = require("../middleware/postMiddleware");
//add new post
router.post("/addPost", validateUser, async (req, res) => {
  try {
    let userId = req.user.id;
    console.log(userId)
    console.log(req.user);
    console.log(userId);
    let user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    let { title, upload, desc } = req.body;
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

// find all post of the user
router.get("/allPosts", async (req, res) => {
  try {
// <<<<<<< main
//     let posts = await Post.find({}).populate('userId');
//     res.status(200).send({ posts: posts });
// =======
   let page= parseInt(req.query.page)  || 1;
   let limit=5
   let skip = (page-1)*limit;
   let allPost= await Post.find({}).skip(skip).limit(limit);
   res.status(200).send({"post":allPost})

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
  
    let { id } = req.params;// this is post id
    let userId = req.user.id;// i get it from header, dont worry about it
 
    
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
   for(let item of post.likes){
    console.log(item.likedBy.toString())
    if(item.likedBy.toString()==userId){
      console.log('hello')
      res.status(200).send({"message":"already liked"})
      return;
    }
   }
    

    let person = await User.findById(userId);
    if (!person) {
      return res.status(404).send({ message: "User not found" });
    }
    let index= post.dislikes.findIndex((item)=>{ return item.dislikedBy.toString()==userId})
    console.log(index);
    post.dislikes.splice(index,1);
    let newObj={
        likedBy:person._id,
    

    }
    post.likes.push(newObj);
    await post.save();
 //}

    res.status(202).send({"message":"post liked successfully"})


 }
 catch(err){
    res.status(500).send({"message":err.message})
 }
})
//--------------------------------------------------------------
//dislike post
router.get("/dislike/post/:id",validateUser,async(req,res)=>{
  try{
   
     let { id } = req.params;// this is post id
     let userId = req.user.id;// i get it from header, dont worry about it
  
     
     let post = await Post.findById(id);
     if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    for(let item of post.dislikes){
     console.log(item.dislikedBy.toString())
     if(item.dislikedBy.toString()==userId){
      
       res.status(200).send({"message":"already disliked"})
       return;
     }
    }
     let person = await User.findById(userId);
     if (!person) {
       return res.status(404).send({ message: "User not found" });
     }
let index= post.likes.findIndex((item)=>{return item.likedBy.toString()==userId})
  console.log(index);
  post.likes.splice(index,1);
  
     let newObj={
         dislikedBy:person._id,
        
 
     }
     post.dislikes.push(newObj);
     await post.save();
   
 
     res.status(202).send({"message":"post disliked successfully"})
 
 
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
  //finding particular post

  router.get("/post/:id",validateUser,async(req,res)=>{
    try{

      let {id}= req.params;
    let found=await Post.findById(id);
  if(!found){
    res.send({"message":"post not found with the given id"});
  return;
}
else{
  res.status(200).send({"post":found});
}
}catch(err){
  res.status(500).send({"message":err.message})
}

  })

module.exports = router;
