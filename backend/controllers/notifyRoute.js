const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {validateUser} = require('../middleware/postMiddleware');



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

module.exports = router;