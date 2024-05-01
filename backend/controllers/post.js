const express= require("express");
const router= express.Router();
const Post= require("../models/Post");
const User= require("../models/User")

//add new post
router.post("/addPost/:id",async(req,res)=>{
    try{

        let {id:userId}= req.params;
        let user=  await User.findById(userId);
        if(!user){
            res.status(404).send({message:"user not found"})
        }
        let {title,upload,description:desc} = req.body;
        let newPost=await Post.create({userId ,title,upload,desc})
        console.log(newPost);
       await newPost.save();
       await user.posts.push(newPost);
      await  user.save();
        res.status(201).send({message:"successfully added you post"});
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})


// delete post
router.delete("/deletePost/:id",async(req,res)=>{
    try{

        let {id}= req.params;
        let deleted= await Post.findByIdAndDelete(id)
        
        if(!deleted){
            res.status(404).send({message:"post is not found"});
        }
        else{
            
            let userId = deleted.userId.toString();
            let user = await  User.findById(userId);
            let index= user.posts.indexOf(id);
            await User.updateOne({ _id: userId }, { $pull: { posts: user.posts[index] } });
           user.save();
           
          res.status(201).send({message:'successfully deleted post'})
        }
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
})




















module.exports=router;