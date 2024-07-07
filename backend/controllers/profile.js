let express = require("express");
let router = express.Router();
let User = require("../models/User");
let Education = require("../models/Education");
const { validateUser } = require("../middleware/postMiddleware");

//all users
router.get("/getAll", async (req, res) => {
  try {
    let allUser = await User.find({});
    res.status(200).send(allUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// finding a particular user
router.get("/user/:id",async(req,res)=>{
  try{
    let {id}= req.params;
    let user= await User.findById(id).populate('education').populate({path:'posts',populate:{path:'userId comments.commentedBy',select:'firstName lastName photo'}}).populate({path:'friends',select:'photo userName'}).populate({path:'notifications',populate:{path:'friend',select:'firstName lastName userName'}});
    console.log("user: ",user);
    res.status(201).send(user);
  }
  catch(err){
    res.status(500).send({error:err})
  }
})

// update profile
router.put('/update-profile',validateUser,async (req,res)=>{
  let userId = req.user.id;
  let {firstName,lastName,email,phone} = req.body;
  try{
    let user = await User.findById(userId);
    if(!user){
      return res.status(404).json("Not Found");
    }
   user = await User.findByIdAndUpdate(userId,{firstName,lastName,email,phone})
    await user.save();
    res.status(200).json("Success");
  }
  catch(e){
    console.log("Failed to update profile error: ",e);
    res.status(500).json("Internal Error");
  }
  })

router.post('/add-education',validateUser,async(req,res)=>{
  let userId = req.user.id;
  let {school, college} = req.body;
  try{
   let user = await User.findById(userId);
   if(!user){
    return res.status(404).json("Not Found");
   }
   let education = new Education({school , college});
   await education.save();
  
   if(user.education){
    await Education.findByIdAndDelete(user.education);
   }
   user.education = education._id;
   await user.save();
   res.status(201).json("Success");
  }
  catch(e){
    console.log("failed to add education error: ",e);
    res.status(500).json("Internal Error");
  }
  })
  
  router.put('/update-education',validateUser,async(req,res)=>{
  let userId = req.user.id;
  let {school,college} = req.body;
  try{
  let user = await User.findById(userId);
  if(!user){
    return res.status(404).json("Not Found User");
  }
  let education = await Education.findById(user.education);
  if(!education){
    return res.status(404).json("Not Found Education");
  }
   education = await Education.findByIdAndUpdate(user.education,{school,college});
   await education.save();
   await user.save();
   res.status(200).json("Success");
  }
  catch(e){
    console.log("failed to update education error: ",e);
    res.status(500).json("Internal Error");
  }
  })
  
  router.delete('/delete-education',validateUser,async(req,res)=>{
  let userId = req.user.id;
  try{
  let user = await User.findById(userId);
  if(user.education){
    await Education.findByIdAndDelete(user.education);
  }
  user.education = null;
  await user.save();
  res.status(200).json(user);
  }
  catch(e){
    console.log("failed to delete education error: ",e);
    res.status(500).json("Internal Error");
  }
  })


module.exports = router;
