const  express = require("express");
const  router= express.Router();
const  User= require("../models/User")
const {setToken,getUser}= require("../middleware/jwt");



//validate user
router.post("/login/", async(req,res)=>{
    try{
    let {userName,password}= req.body;
    let user= await User.findOne({userName:userName});
    console.log(user.password);
    let token=setToken(user);
    if(user){
        console.log(password , user.password,typeof(password),typeof(user.password))
        if(user.password==password){

            let item=res.cookie("uid",token);
            console.log(item);
            res.status(201).send({message:"person authorised, right userName and password"})
        }
        else{
            res.status(401).send({message:"person is unauthorised, wrong userName and password"})
        }
    }
    else{
        res.status(400).send({message:"user is not found"});
    }
    

    }
    catch(err){
        res.status(500).send({error:err.message});
    }
})

router.get("/check",async (req,res)=>{
    try{

        let token=req.cookies.uid;
        // console.log(token);
        let item= getUser(token);
        // console.log(item);
        res.send({ message: "ok",token:token,item:item});
    }
    catch(err){
        res.status(500).send({message:err.message});
    }


})
















module.exports=router;