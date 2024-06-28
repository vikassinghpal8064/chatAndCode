const Friend = require('../models/Friend');
const {getUser}= require('./jwt')



// const validateUser = (req, res, next) => {
//     try {
//         console.log('i am inside validate user')
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];

//         if (!token) {
//              res.status(401).send({ message: 'No token provided' });
//              return;
//         }

//         const user = getUser(token);
//         console.log(user);
//         if (!user) {
//              res.status(401).send({ message: 'Invalid token' });
//              return;
//         }

//         // Attach the user information to the request object
//         req.user = user;

//         next();
//     } catch (err) {
//         res.status(500).send({ message: err.message });
//     }
// };
function validateUser(req, res, next) {
    try {
      console.log('Inside validateUser middleware');
      const authHeader = req.headers['authorization'];
      console.log('Auth Header:', authHeader);
      const token = authHeader && authHeader.split(' ')[1];
      console.log('Token:', token);
  
      if (!token) {
        res.status(401).send({ message: 'No token provided' });
        return;
      }
  
      const user = getUser(token);
      console.log('User:', user);
  
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
  }
 // alraedy a friend or not

 const existingFriendOrNot = async (req,res,next)=>{
    try{
        let {id}= req.params;
        let userId= req.user.id;
        let found = await Friend.findOne({$or:[{sourceId:id, targetId:userId},{sourceId:userId, targetId:id}]})
        if(found){
           return res.status(400).send({message:"already a friend"});
        }
        next();
    }
    catch(err){
        return res.status(500).send({message:err.message});
    }
 }

module.exports={validateUser,existingFriendOrNot}