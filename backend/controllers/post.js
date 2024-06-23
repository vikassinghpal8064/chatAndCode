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
    user.posts.push(newPost);
    await user.save();
    res.status(201).send({ message: "successfully added you post" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// find all post of the user
router.get("/allPosts", async (req, res) => {
  try {
   let page= parseInt(req.query.page)  || 1;
   let limit=5
   let skip = (page-1)*limit;
   let allPost= await Post.find({}).populate('userId').populate({path:'comments.commentedBy',select:'firstName lastName photo'}).skip(skip).limit(limit);
   res.status(200).send({posts:allPost})
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
      await user.save();
      return res.status(201).send({ message: "successfully deleted post" });
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
   for(let item of post.likes){
    if(item.likedBy.toString()==userId){
      return res.status(200).send({message:"already liked"});
    }
   }

    let person = await User.findById(userId);
    if (!person) {
      return res.status(404).send({ message: "User not found" });
    }
    let index= post.dislikes.findIndex((item)=>{ return item.dislikedBy.toString()==userId})
    if(index !== -1){
      post.dislikes.splice(index,1);
    }
    let newObj={
        likedBy:person._id,
    }
    post.likes.push(newObj);
    await post.save();
    return res.status(202).send({message:"post liked successfully"});
 }
 catch(err){
    return res.status(500).send({message:err.message});
 }
})
//--------------------------------------------------------------
//dislike post
router.get("/dislike/post/:id",validateUser,async(req,res)=>{
  try{
   
     let { id } = req.params;
     let userId = req.user.id;
     let post = await Post.findById(id);
     if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    for(let item of post.dislikes){
     if(item.dislikedBy.toString()==userId){
      return res.status(200).send({message:"already disliked"})
     }
    }
     let person = await User.findById(userId);
     if (!person) {
       return res.status(404).send({ message: "User not found" });
     }
let index= post.likes.findIndex((item)=>{return item.likedBy.toString()==userId})
  if(index !== -1){
    post.likes.splice(index,1);
  }
  
     let newObj={
         dislikedBy:person._id,
     }
     post.dislikes.push(newObj);
     await post.save();
     res.status(202).send({message:"post disliked successfully"})
  }
  catch(err){
     res.status(500).send({message:err.message})
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
      let oldPost = await Post.findById(id).populate({path:'comments.commentedBy',select:'photo firstName lastName'});
      let comments = oldPost.comments;
      res.status(201).send({ message: "Comment is added" ,comments:comments});
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
   return res.send({"message":"post not found with the given id"});
  }else{
  return res.status(200).send({post:found});
  }
}catch(err){
  res.status(500).send({"message":err.message})
}
})

//------------------ check trending users as posts-------------
router.get('/top-users', async (req, res) => {
  try {
    // Step 1: Aggregate posts by user
    const userScores = await Post.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalDislikes: { $sum: { $size: "$dislikes" } }
        }
      },
      {
        $project: {
          _id: 1,
          score: {
            $add: [
              { $multiply: ["$totalPosts", 0.3] },
              { $multiply: ["$totalLikes", 0.5] },
              { $multiply: ["$totalDislikes", -0.3] }
            ]
          }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Step 2: Populate user details
    const topUsers = await User.find({
      _id: { $in: userScores.map(score => score._id) }
    }).lean();

    // Step 3: Map scores to users
    const topUsersWithScores = topUsers.map(user => {
      const userScore = userScores.find(score => score._id.equals(user._id));
      return {
        ...user,
        score: userScore.score
      };
    });

    res.status(200).json(topUsersWithScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ---------------- chek trending users as posts with top post an worst post--------------
router.get('/top-user', async (req, res) => {
  try {
    // Step 1: Aggregate posts by user for scores
    const userScores = await Post.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalDislikes: { $sum: { $size: "$dislikes" } }
        }
      },
      {
        $project: {
          _id: 1,
          score: {
            $add: [
              { $multiply: ["$totalPosts", 0.3] },
              { $multiply: ["$totalLikes", 0.5] },
              { $multiply: ["$totalDislikes", -0.3] }
            ]
          }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Step 2: Find top post (most likes) for each user
    const topPosts = await Post.aggregate([
      {
        $match: {
          userId: { $in: userScores.map(score => score._id) }
        }
      },
      {
        $addFields: { likesCount: { $size: "$likes" } }
      },
      {
        $sort: { userId: 1, likesCount: -1 }
      },
      {
        $group: {
          _id: "$userId",
          topPost: { $first: { _id: "$_id", title: "$title", likesCount: "$likesCount" } }
        }
      }
    ]);

    // Step 3: Find worst post (most dislikes) for each user
    const worstPosts = await Post.aggregate([
      {
        $match: {
          userId: { $in: userScores.map(score => score._id) }
        }
      },
      {
        $addFields: { dislikesCount: { $size: "$dislikes" } }
      },
      {
        $sort: { userId: 1, dislikesCount: -1 }
      },
      {
        $group: {
          _id: "$userId",
          worstPost: { $first: { _id: "$_id", title: "$title", dislikesCount: "$dislikesCount" } }
        }
      }
    ]);

    // Step 4: Populate user details with restricted fields
    const topUsers = await User.find({
      _id: { $in: userScores.map(score => score._id) }
    }).select('username email') // Specify the fields you want to include
      .lean();

    // Step 5: Map scores and posts to users
    const topUsersWithScoresAndPosts = topUsers.map(user => {
      const userScore = userScores.find(score => score._id.equals(user._id));
      const userTopPost = topPosts.find(post => post._id.equals(user._id));
      const userWorstPost = worstPosts.find(post => post._id.equals(user._id));
      return {
        ...user,
        score: userScore.score,
        topPost: userTopPost ? userTopPost.topPost : null,
        worstPost: userWorstPost ? userWorstPost.worstPost : null
      };
    });

    res.status(200).json(topUsersWithScoresAndPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
