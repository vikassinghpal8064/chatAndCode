const { Server } = require("socket.io");

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
    socket.on('message', (msg) => {
      io.emit("message", msg);
    });
  });
}

module.exports = { chat };
