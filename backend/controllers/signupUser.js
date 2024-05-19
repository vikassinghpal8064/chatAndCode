let express = require("express");
let router = express.Router();
let User = require("../models/User");
let Education = require("../models/Education");

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
router.post("/user/:id",async(req,res)=>{
  try{

    let id= req.params;
    // console.log(id);
    let user= await User.findById(id.id);
    // console.log(user);
    res.status(201).send(user);
  }
  catch(err){
    res.status(500).send({error:err})
  }
})

//adding a new user
router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, userName, password, email, phone } = req.body;
    if(firstName==null || lastName==null || userName==null || password==null || email == null || phone==null){
      res.status(201).send({message:"please fill all required fields"});
      return;
    }
    let newUser = await User.create({
      firstName,
      lastName,
      
      userName,
      password,
      email,
      phone,
    });
    console.log(newUser);
    newUser.save();
    res.status(201).send({ message: "the user is successfully resgistered" });
    return;
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//updating userEducation info
router.post("/userEdu/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);
    let { school, college } = req.body;
    // console.log(user.education._id);
    if (user.education._id.toString()) {
      let item = await Education.findByIdAndDelete(
        user.education._id.toString()
      );
    //   console.log("i am deleted  ", item._id);
      let education = await Education.create({ school, college });
      education.save();
      //    console.log(education);
      user.education = education._id;
      user.save();
    } else {
      let education = await Education.create({ school, college });
      education.save();
      console.log(education);
      user.education = education._id;
      user.save();
    }

    res.status(201).send({ message: "successsfully created" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/allUsers",async(req,res)=>{
  try{
  let users= await User.find({});
  // console.log(users);
  res.status(201).send(users);
  }catch(err){
    res.status(500).send({error:err});
  }
})

module.exports = router;
