
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');
const { getUser } = require("../../middleware/jwt");
const Friend = require("../../models/Friend");
const Chat = require("../../models/Chat");

const uploadDir = path.join(__dirname, 'assets');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
        const { sourceId, targetId, message, firstMess, fileName, fileData } = msg;
        const { id } = getUser(sourceId);
        console.log('Received message:', msg); // Log received message
        console.log("filename: ",fileName);
    
        if (fileData) {
          // Decode the base64 file data
          const buffer = Buffer.from(fileData, 'base64');
    
          // Save the file to the server
          const filePath = path.join(uploadDir, fileName);
          fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              console.error('Failed to write file', err);
              return;
            }
            console.log('File uploaded successfully', filePath);
    
            const fileMessage = { sourceId, targetId, message: `File uploaded: ${fileName}`, filePath };
            if (socket.room) {
              io.to(socket.room).emit("message", fileMessage);
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
