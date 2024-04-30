let express = require("express");
let router= express.Router();
let User= require("../models/User")




//validate user
router.post("/login/", async(req,res)=>{
    try{
    let {userName,password}= req.body;
    let user= await User.findOne({userName:userName});
    console.log(user.password);
    if(user){
        console.log(password , user.password,typeof(password),typeof(user.password))
        if(user.password==password){
            res.status(201).send({message:"person authorised, right userName and password"})
        }
        else{
            res.status(401).send({message:"person is unauthorised, wrong userName and password"})
        }
    }
    

    }
    catch(err){
        res.status(500).send({error:err.message});
    }
})

















module.exports=router;