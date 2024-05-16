const  express = require("express");
const  router= express.Router();
const  User= require("../models/User")
const {setToken,getUser}= require("../middleware/jwt");



//validate user
router.post("/login", async(req, res) => {
    try {
        let { userName, password } = req.body;
        if (!userName || !password) {
            res.status(400).send({ message: "userName and password are required" });
            return;
        }
        let user = await User.findOne({ userName: userName });
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        if (user.password === password) {
            let token = setToken(user._id);
            // Set the cookie and send it in the response
            res.cookie("uid", token,{maxAge:36000000,httpOnly:true , secure:false ,sameSite:"lax"});
            res.status(201).send({ message: "Person authorized, correct username and password" ,
                uid:token
            });
        } else {
            res.status(401).send({ message: "Unauthorized, wrong username and password" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


router.get("/check",async (req,res)=>{
    try{

        let token=document.cookie
        console.log(token);
        let item= getUser(token);
        console.log(item);
        res.send({ message: "ok",token:token,item:item});
    }
    catch(err){
        res.status(500).send({message:err.message});
    }


})
















module.exports=router;