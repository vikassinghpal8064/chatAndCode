const { Server } = require("socket.io");
const {setToken,getUser} = require("../../middleware/jwt");
const Friend = require("../../models/Friend");
const Chat = require("../../models/Chat");
function chat(server) {
  let io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    connectionStateRecovery:{}

  });

  io.on("connection", (socket) => {
    socket.on('message', async(msg) => {
      let {sourceId,targetId,message}=msg;

      console.log(targetId,message);
      let {id}= getUser(sourceId);
      // console.log(userId.id);
      
      //finding friend
      let found=await Friend.findOne({$or:[{sourceId:targetId,targetId:sourceId},{sourceId:id,targetId:targetId}]});
      let chatMess = await Chat.create({sourceId:id,targetId:targetId,message:message});
      console.log(chatMess);
      found.chats.push(chatMess);
     await chatMess.save();
     await found.save();
      

      io.emit("message", message);
    });
  });
}

module.exports = { chat };
