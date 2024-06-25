const Friend = require('../models/Friend');
const {getUser}= require('./jwt')



const validateUser = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
             res.status(401).send({ message: 'No token provided' });
             return;
        }

        const user = getUser(token);

        if (!user) {
             res.status(401).send({ message: 'Invalid token' });
             return;
        }

        // Attach the user information to the request object
        req.user = user;

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
 // alraedy a friend or not

 const existingFriendOrNot = async (req,res,next)=>{
    try{
        let {id}= req.params;
        let userId= req.user.id;
        let found = await Friend.findOne({$or:[{sourceId:id, targetId:userId},{sourceId:userId, targetId:id}]})
        if(found){
           return res.status(400).send({message:"alraedy a friend"});
        }
        next();
    }
    catch(err){
        res.status(500).send({message:err.message});
        return;
    }
 }

module.exports={validateUser,existingFriendOrNot}