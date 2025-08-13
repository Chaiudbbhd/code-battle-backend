// controllers/roomController.js
const Room = require("../models/Room");

let ioInstance; // store Socket.IO instance here

// 🔌 Inject Socket.IO instance from server.js
exports.injectSocket = (io) => {
  ioInstance = io;
};

// ✅ Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    console.error("❌ Failed to fetch rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// ✅ Create room + emit event
exports.createRoom = async (req, res) => {
  try {
    const { title, difficulty, maxParticipants, timer, platforms, host } = req.body;

    if (!title || !host || !maxParticipants) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newRoom = await Room.create({
      title,
      difficulty: difficulty || "Easy",
      maxParticipants,
      timer: timer || 300,
      platforms: platforms || [],
      host,
      participants: 1,
      status: "waiting",
    });

    if (ioInstance) ioInstance.emit("roomCreated", newRoom);

    res.status(201).json({ success: true, room: newRoom });
  } catch (err) {
    console.error("❌ Error creating room:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// ✅ Join room + emit update
exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.participants >= room.maxParticipants) {
      return res.status(400).json({ error: "Room is full" });
    }

    room.participants += 1;
    await room.save();

    // Emit updated room to all clients
    if (ioInstance) {
      ioInstance.emit("roomUpdated", room);
    }

    res.json({ success: true, room });
  } catch (err) {
    console.error("❌ Error joining room:", err);
    res.status(500).json({ error: err.message });
  }
};
