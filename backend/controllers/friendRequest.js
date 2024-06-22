const express= require("express");
const router= express.Router();
const Friend= require("../models/Friend");
const User= require("../models/User");
const{setUser,getUser}= require("../middleware/jwt");
const {validateUser} = require("../middleware/postMiddleware")

//sending a friend request;
router.get("/friendRequest/:id", validateUser, async(req,res)=>{
    try{

       console.log("hello")
        let {id}= req.params;
        console.log(req.user);
        let userId=req.user.id;
        let user= await User.findById(id);
        if(!user){
          res.status(400).send({'message':"user not found"})
        }
        console.log(id,userId);
        let friendObj= await Friend.create({sourceId:userId,targetId:id});
    
 
 let notificationObj={
    friend:friendObj,
    message:"someone send you a friend Request"
}
await User.updateOne({_id:id,},{$push:{notifications:notificationObj}});
await user.save();
res.status(201).send({message:"friend request is sent successfully"});
}
catch(err){
    res.status(500).send({message:err.message})
}

})

//accepting a friend request

router.get("/acceptRequest", validateUser, async(req,res)=>{
    try{
  let userId=req.user.id;
  let user= await User.findById(userId);
  console.log(user)
  if(user.notifications.length==0){
    res.status(200).send({"message":"no message in notification"});
    return;
  }
  let friendId= user.notifications[0].friend.toString();
  console.log(friendId);
  
  let friend= await Friend.findById(friendId);
  console.log(friend);
  let senderId= friend.sourceId.toString();
  let sender= await User.findById(senderId);
  sender.friends.push(friend);
user.friends.push(friend);
user.notifications.pop();
user.save();
sender.save();
res.status(201).send({message:"friend Request accepted"});
  
    
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})


//reject request
router.get("/rejectRequest", validateUser ,async(req,res)=>{
    try{
      let userId= req.user.id;
       
  let user= await User.findById(userId);
  let friendId= user.notifications[0].friend.toString();
  
  let friend= await Friend.findByIdAndDelete(friendId);

user.notifications.pop();
user.save();
  res.status(201).send({message:"friend Rrquest rejected"});
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})

//finding all friens of the login user
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




module.exports=router;
