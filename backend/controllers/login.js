const  express = require("express");
const  router= express.Router();
const  User= require("../models/User")
const {setToken,getUser}= require("../middleware/jwt");



//validate user
router.post("/login", async(req, res) => {
    try {
        let { userName, password } = req.body;
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
                uid:token
            });
        } else if(user.password !== password){
            res.status(400).send({ message: "incorrect password or username" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


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
















module.exports=router;