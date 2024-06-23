let express = require("express");
let router = express.Router();
let User = require("../models/User");
let Education = require("../models/Education");
const {setToken,getUser}= require("../middleware/jwt");
const { validateUser } = require("../middleware/postMiddleware");

//adding a new user
router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, userName, password, email, phone } = req.body;
    if(firstName==null || lastName==null || userName==null || password==null || email == null || phone==null){
    return res.status(204).json("empty field");
    }
    let Username = await User.findOne({userName});
    let Email = await User.findOne({email});
    if(Username){
      return res.status(200).json("username exist");
    }
    if(Email){
      return res.status(200).json("email exist");
    }
    let newUser = await User.create({firstName,lastName,email,userName,password,phone})
    newUser.save();
    return res.status(201).json("success");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//validate user
router.post("/login", async(req, res) => {
    try {
      console.log("hello")
        let { userName, password } = req.body;
        console.log(userName,password);
        if (!userName || !password) {
           return res.status(400).send({ message: "username and password are required" });
        }
        let user = await User.findOne({ userName: userName });
        if (!user) {
           return res.status(404).send({ message: "user not found" });
        }
        if (user.password === password) {
            let token = setToken(user._id);
            // Set the cookie and send it in the response
            res.cookie("uid", token,{maxAge:36000000,httpOnly:true , secure:false ,sameSite:"lax"});
            res.status(200).send({ message: "success" ,
                uid:token,userId:user._id
            });
        } else if(user.password !== password){
            res.status(400).send({ message: "incorrect password or username" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// check route
router.get("/check",async (req,res)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let item= getUser(token);
        console.log(item);
        res.send({ message: "ok",token:token});
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
})

module.exports = router;
