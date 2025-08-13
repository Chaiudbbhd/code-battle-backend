// backend/src/socket/roomSocket.js
const { v4: uuidv4 } = require("uuid");
const rooms = [];

function roomSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("getRooms", () => {
      socket.emit("roomsList", rooms);
    });

    socket.on("createRoom", (roomData) => {
      const newRoom = {
        _id: uuidv4(),
        name: roomData.name || "Untitled Room",
        host: roomData.host || "Guest",
        maxParticipants: roomData.maxParticipants || 6,
        players: [],
        status: "waiting",
        difficulty: roomData.difficulty || "Easy",
        platforms: roomData.platforms || []
      };
      rooms.push(newRoom);
      io.emit("roomsList", rooms);
    });

    socket.on("joinRoom", ({ roomId, username }) => {
      const room = rooms.find(r => r._id === roomId);
      if (room) {
        if (!room.players) room.players = [];
        room.players.push(username);
        io.emit("roomsList", rooms);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = roomSocket;
