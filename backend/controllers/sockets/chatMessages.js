const express=require("express");
const router= express.Router();
const {getUser} =require("../../middleware/jwt");
const Friend = require("../../models/Friend");



router.get("/user/chat",async(req,res)=>{
  try{

    let {sourceId,targetId}=req.query;
    console.log(sourceId,targetId);
    let {id}= getUser(sourceId);
    let friend= await Friend.findOne({$or:[{sourceId:id,targetId:targetId},{sourceId:targetId,targetId:id}]}).populate('chats');
    
    res.status(201).send(friend.chats);
  }catch(err){
    res.status(500).send({"error":err})
  }
  })



  module.exports=router