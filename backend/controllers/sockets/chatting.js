const { Server } = require("socket.io");
const { setToken, getUser } = require("../../middleware/jwt");
const Friend = require("../../models/Friend");
const Chat = require("../../models/Chat");
const { generateId } = require("../../middleware/generateId");

function chat(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    connectionStateRecovery: {}
  });

  io.on("connection", (socket) => {
    socket.on('joinRoom', (room) => {
      console.log(room);
      socket.join(room);
      socket.room = room; // Save the room in the socket instance
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      delete socket.room; // Remove the room from the socket instance
    });

    socket.on('message', async (msg) => {
      try {
        const { sourceId, targetId, message, firstMess } = msg;
        const { id } = getUser(sourceId);
        console.log(id, targetId, message);

        let found = await Friend.findOne({ $or: [{ sourceId: targetId, targetId: id }, { sourceId: id, targetId: targetId }] });
        let chatMess = await Chat.create({ sourceId: id, targetId: targetId, message: message });
        console.log(found);
        found.chats.push(chatMess);
        await chatMess.save();
        await found.save();

        const obj = { sourceId, targetId, message };
        if (socket.room) { // Check if the room is defined in the socket instance
          io.to(socket.room).emit("message", obj);
        } else {
          console.error("Room is not defined in the socket instance");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
}

module.exports = { chat };
