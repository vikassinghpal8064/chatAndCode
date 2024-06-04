const express= require("express");
const router= express.Router();
const jwt= require("jsonwebtoken");
const dotenv = require('dotenv').config({path: path.resolve(__dirname,'../.env')});
const secretKey=process.env.ACCESS_TOKEN_SECRET;

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