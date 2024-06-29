const express= require("express");
const router= express.Router();
const mongoose = require('mongoose');
const Friend= require("../models/Friend");
const User= require("../models/User");
const{setUser,getUser}= require("../middleware/jwt");
const {validateUser , existingFriendOrNot} = require("../middleware/postMiddleware")

//sending a friend request;
router.get("/friendRequest/:id", validateUser,existingFriendOrNot, async(req,res)=>{
  try{
    let {id}= req.params ;
    let userId=req.user.id;
    let user= await User.findById(id);
        if(!user){
         return res.status(400).send({message:"user not found"});
        }
        let friendObj= await Friend.create({sourceId:userId,targetId:id});
        await friendObj.save();
        console.log("Type of friendObj:", typeof friendObj);
        console.log("Instance of friendObj:", friendObj instanceof Friend);
        console.log("Type of friendObj._id:", typeof friendObj._id);
        console.log("Instance of friendObj._id:", friendObj._id instanceof mongoose.Types.ObjectId);
 let notificationObj1={
    friend:friendObj._id,
    category:"sendRequest",
    message:"send you a friend request."
}
await User.updateOne({_id:id,},{$push:{notifications:notificationObj1}});
await user.save();
return res.status(201).send({message:"success"});
}
catch(err){
  return res.status(500).send({message:err.message})
}
})


//accepting a friend request
router.get("/acceptRequest/:index", validateUser, async(req,res)=>{
    try{
   let {index} = req.params || 0;
  let userId = req.user.id;
  let user = await User.findById(userId);
  
  if(user.notifications.length <= index){
    return res.status(400).send({message:"empty notification"});
  }
  let friendId = user.notifications[index].friend.toString();
  let friend= await Friend.findById(friendId);
  let senderId = friend.sourceId.toString();
  let sender= await User.findById(senderId);
  sender.friends.push(friend);
  user.friends.push(friend);
  if(index >= 0){
    user.notifications.splice(index,1);
  }
  let notificationObj = {
    friend:friend._id,
    category:"friendRequest",
    message: "accepted your friend request."
  }
sender.notifications.push(notificationObj);
   await user.save();
  await sender.save();
  return res.status(201).send({message:"success"});
    }
    catch(err){
      return res.status(500).send({message:err.message})
    }
})

//reject request
router.get("/rejectRequest/:index", validateUser ,async(req,res)=>{
    try{
      let userId = req.user.id;
       let {index} = req.params ;
  let user = await User.findById(userId);
  if(user.notifications.length <= index){
    return res.status(400).send({message:"empty notification"});
  }
  let friendId = user.notifications[index].friend.toString();
  let friend = await Friend.findByIdAndDelete(friendId);

  if(index >= 0){
    user.notifications.splice(index,1);
  }
  await user.save();
  return res.status(201).send({message:"success"});
    }
    catch(err){
      return res.status(500).send({message:err.message})
    }
})

//finding all friends of the login user
router.get("/getAllFriends/:id",validateUser,async(req,res)=>{
  try{
     let {id} = req.params;
     let userId = req.user.id;
     if(id == userId){
      ;   let user = await  User.findById(id)
          let friendsList = [];
          for(let item of user.friends){
            let friendItem = await Friend.findById(item.toString());
            let sourceId = friendItem.sourceId;
            let targetId = friendItem.targetId;
            if(id != sourceId){
              let friend = await User.findById(sourceId).select('firstName lastName photo email userName')
              let newObj = {...friend._doc,friendId:friendItem._id}
              friendsList.push(newObj);
            }else{
              let {_doc} = await User.findById(targetId).select('firstName lastName photo email userName')
              let newObj={..._doc,  friendId:friendItem._id.toString()}
              friendsList.push(newObj);
            }
          }
          return res.status(201).send(friendsList);
     }else{
      ;   let user = await  User.findById(id)
          let friendsList = [];
          for(let item of user.friends){
            let friendItem = await Friend.findById(item.toString());
            let sourceId = friendItem.sourceId;
            let targetId = friendItem.targetId;
            if(id != sourceId){
              let friend = await User.findById(sourceId).select('firstName lastName photo')
              let newObj = {...friend._doc,friendId:friendItem._id}
              friendsList.push(newObj);
            }else{
              let {_doc} = await User.findById(targetId).select('firstName lastName photo')
              let newObj={..._doc,  friendId:friendItem._id.toString()}
              friendsList.push(newObj);
            }
          }
          return res.status(201).send(friendsList);
     }
  }
  catch(err){
   return res.status(500).send({error:err.message});
  }
});

// notification
router.get("/notification", validateUser ,async(req,res)=>{
  try{

    let userId = req.user.id;
  
    let fullNotification=[];
    let user = await User.findById(userId).populate("notifications.friend");
    for(let item of user.notifications){
      let sourcePersonInfo= await User.findById(item.friend.sourceId);
      let targetPersonInfo= await User.findById(item.friend.targetId);
       let obj={
        details:item,
        sourcePersonInfo:sourcePersonInfo,
        targetPersonInfo:targetPersonInfo
       }
       fullNotification.push(obj);
     }
  res.status(200).send({message:"success",notification:fullNotification});
  }
  catch(err){
    res.status(500).send({message:err.message})
  }

})

// delete notification
router.delete("/notification/delete/:index", validateUser,async(req,res)=>{
  try{
    let userId = req.user.id;
    let user= await User.findById(userId);
    if(user.notifications.length <= index){
      return res.status(400).send({message:"empty notification"});
    }
    if(index >= 0){
      user.notifications.splice(index,1);
    }
    await user.save();
    return res.status(200).send({message:"success"})
  }
  catch(err){
    return res.status(500).send({message:err.message})
  }
})


module.exports=router;
