
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
      let {sourceId,targetId,message,firstMess}=msg;

      // console.log(targetId,message);
      let {id}= getUser(sourceId);
     
      let found=await Friend.findOne({$or:[{sourceId:targetId,targetId:sourceId},{sourceId:id,targetId:targetId}]})
      let chatMess = await Chat.create({sourceId:id,targetId:targetId,message:message});
      console.log(chatMess);
      found.chats.push(chatMess);
     await chatMess.save();
     await found.save();
       //find the already stored messages
      //  const alreadyMess=[];
      //  if(firstMess==true){
      //  for(let item of found.chats){
      //   alreadyMess.push(item.message);
      //  }
      //  console.log(alreadyMess);
      //  io.emit("message", alreadyMess);
      //  return;
      //  }
      //  else{
      //    alreadyMess.push(message);
      //    io.emit("message", alreadyMess);
      //  }
      let obj={sourceId:sourceId,targetId:targetId,message:message}
      io.emit("message",obj);

      
    });
  });
}





module.exports = { chat };
