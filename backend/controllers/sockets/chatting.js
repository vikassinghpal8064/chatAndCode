
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const { getUser } = require("../../middleware/jwt");
const Friend = require("../../models/Friend");
const Chat = require("../../models/Chat");

const uploadDir = path.join(__dirname, "assets");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function chat(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
      console.log(room);
      socket.join(room);
      socket.room = room; // Save the room in the socket instance
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      delete socket.room; // Remove the room from the socket instance
    });

    socket.on("message", async (msg) => {
      try {
        const { sourceId, targetId, message, fileName, fileData } = msg;
        // const { id } = getUser(sourceId);
        console.log("Received message:", msg); // Log received message
        console.log("filename: ", fileName);

        // Store chat in friend
        if (!fileData) {
          let chatObj = { sourceId: sourceId, targetId: targetId, message: message };
          let newChat = await Chat.create(chatObj);
          newChat.save();
          let friend = await Friend.findOne({
            $or: [
              { sourceId: sourceId, targetId: targetId },
              { sourceId: targetId, targetId: sourceId },
            ],
          });
          friend.chats.push(newChat);
          friend.save();
        }

        if (fileData) {
          // Decode the base64 file data
          const buffer = Buffer.from(fileData, "base64");

          // Save the file to the server
          const filePath = path.join(uploadDir, fileName);
          fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              console.error("Failed to write file", err);
              return;
            }
            console.log("File uploaded successfully", filePath);

            const fileMessage = {
              sourceId,
              targetId,
              message: `File uploaded: ${fileName}`,
              filePath,
              fileUrl: `http://localhost:8080/assets/${fileName}` // Assuming your static files are served from /assets
            };

            console.log(`Emitting message to room: ${socket.room}`);
          if (socket.room) {
            console.log("hello");
            io.to(socket.room).emit("message", fileMessage);
          } else {
            console.log("No room joined");
          }
          });
        } else {
          const textMessage = { sourceId, targetId, message };
          if (socket.room) {
            io.to(socket.room).emit("message", textMessage);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
}

module.exports = { chat };
