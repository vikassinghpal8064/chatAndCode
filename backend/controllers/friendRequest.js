const express= require("express");
const router= express.Router();
const Friend= require("../models/Friend");
const User= require("../models/User");
const{setUser,getUser}= require("../middleware/jwt");


//sending a friend request;
router.post("/friendRequest/:id", async(req,res)=>{
    try{

        let userCookeId = req.cookies.uid;
        let {id}= req.params;
        
        let user= await User.findById(id);
        let friendObj= await Friend.create({sourceId:userCookeId,targetId:id});
    console.log(friendObj,id,);
 
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

router.get("/acceptRequest", async(req,res)=>{
    try{
  let userCookeId="66334cf9d767b9e8f8af7b8b";
  let user= await User.findById(userCookeId);
  let friendId= user.notifications[0].friend._id.toString();
  
  let friend= await Friend.findById(friendId);
//   console.log(friendId,friend);
user.friends.push(friend);
user.notifications.pop();
user.save();
  res.status(201).send({message:"friend Rrquest accepted"});
  
    
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
})


//reject request
router.get("/rejectRequest", async(req,res)=>{
    try{
      let cookeId= req.cookies.uid;
  let userCookeId="66334cf9d767b9e8f8af7b8b";
  let user= await User.findById(userCookeId);
  let friendId= user.notifications[0].friend._id.toString();
  
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
router.get("/getAllFriends",async(req,res)=>{
  try{
    console.log("hello");
    const authHeader = req.headers['authorization'];

const token = authHeader && authHeader.split(' ')[1];
   
   
    let token1= getUser(token);
    // console.log(token1.id);
    let user=await  User.findById(token1.id);
    // console.log(user.friends);
    let friendsList= [];
    for(let item of user.friends){
      // console.log(item.toString());
      let friendItem= await Friend.findById(item.toString());
      console.log(friendItem);
      let sourceId= friendItem.sourceId;
      console.log(sourceId);
      let friend= await User.findById(sourceId);
      friendsList.push(friend);
    }
    console.log(friendsList);
 
    res.status(201).send(friendsList);
  }
  catch(err){
   res.status(500).send({error:err.message});
  }
});




module.exports=router;
