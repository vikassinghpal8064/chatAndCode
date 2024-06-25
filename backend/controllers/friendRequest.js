const express= require("express");
const router= express.Router();
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
      res.status(400).send({message:"user not found"})
    }

    let friendObj= await Friend.create({sourceId:userId,targetId:id});

 let notificationObj1={
    friend:friendObj,
    category:'sendRequest',
    message:"send you a friend request."
}
await User.updateOne({_id:id,},{$push:{notifications:notificationObj1}});
await user.save();
res.status(201).send({message:"sent request"});
}
catch(err){
    res.status(500).send({message:err.message})
}
})

//accepting a friend request
router.get("/acceptRequest/:index", validateUser, async(req,res)=>{
    try{
   let {index} = req.params || 0;
  let userId = req.user.id;
  let user = await User.findById(userId);
  
  if(user.notifications.length <= index){
    return res.status(200).send({message:"no message in notification"});
  }
  let friendId = user.notifications[index].friend.toString();
  
  let friend = await Friend.findById(friendId);
  let senderId = friend.sourceId.toString();
  let sender = await User.findById(senderId);
  sender.friends.push(friend);
  user.friends.push(friend);
  if(index >= 0){
    user.notifications.splice(index,1);
  }
  let notificationObj = {
    friend:null,
    category:"friendRequest",
    message:`your friend request is accepted by ${user.firstName+" "+user.lastName}`
  }
  
   await user.save();
  await sender.save();
  res.status(201).send({message:"accepted request"});
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})


//reject request
router.get("/rejectRequest/:index", validateUser ,async(req,res)=>{
    try{
      let userId= req.user.id;
       let {index}= req.params ;
  let user= await User.findById(userId);
  let friendId = user.notifications[index].friend.toString();
  
  let friend = await Friend.findByIdAndDelete(friendId);

user.notifications.pop();
user.save();
  res.status(201).send({message:"friend Rrquest rejected"});
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})

//finding all friends of the login user
router.get("/getAllFriends",validateUser,async(req,res)=>{
  try{
     let userId= req.user.id
;    let user=await  User.findById(userId)
    let friendsList= [];
    for(let item of user.friends){
      let friendItem= await Friend.findById(item.toString());
      let sourceId= friendItem.sourceId;
      let targetId= friendItem.targetId;
      if(userId!=sourceId){
        let friend= await User.findById(sourceId)
      let newObj={...friend._doc,friendId:friendItem._id}
        friendsList.push(newObj);

      }
      
        else{
          let {_doc}= await User.findById(targetId)
          let newObj={..._doc,  friendId:friendItem._id.toString()}
            friendsList.push(newObj);
    
      }
    }
    console.log(friendsList);

 
    res.status(201).send(friendsList);
  }
  catch(err){
   res.status(500).send({error:err.message});
  }
});

// delete notification
router.delete("/notification/delete/:index", validateUser,async(req,res)=>{
  try{

    let userId= req.user.id;
    let user= await User.findById(userId);
    if(user.notifications.length<index){
      res.status(400).send({message:"invalid request of deletion"}

      )
    }
    user.notifications.splice(index,1);
    user.save();
    res.status(200).send({message:"notification as been deleted"})
  }
  catch(err){
    res.status(500).send({message:err.message})
  }

})


module.exports=router;
