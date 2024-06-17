const express=require("express");
const router= express.Router();
const {getUser} =require("../../middleware/jwt");
const Friend = require("../../models/Friend");

router.get("/user/chat", async (req, res) => {
  try {
   
    let { sourceId, targetId } = req.query;
   

    // Assuming getUser is synchronous for now; otherwise, await its result
    let user = getUser(sourceId);
    let { id } = user;
    

    let friend = await Friend.findOne({
      $or: [
        { sourceId: id, targetId: targetId },
        { sourceId: targetId, targetId: id }
      ]
    }).populate('chats');

    if (!friend) {
      console.log("No friend found with the provided IDs");
      return res.status(404).send({ error: "Friend not found" });
    }

    res.status(201).send(friend.chats);
  } catch (err) {
    console.error("Error in /user/chat route:", err);
    res.status(500).send({ error: err.message || err });
  }
});




  module.exports=router