const express= require("express");
const router= express.Router();
const jwt= require("jsonwebtoken");
const secretKey="vikasSingh8064@@shivani123America";

function setToken(user){
    let payload={
        id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        userName:user.userName
    }
   return jwt.sign(payload,secretKey);
}


function getUser(token){
    return jwt.verify(token,secretKey);
}

module.exports={setToken,getUser};