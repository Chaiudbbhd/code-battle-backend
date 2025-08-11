const Room = require("../models/Room");

// GET: Fetch all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Create a new room
exports.createRoom = async (req, res) => {
  const { name, host } = req.body;
  try {
    const newRoom = new Room({
      name,
      players: [host]
    });
    await newRoom.save();
    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Join an existing room
exports.joinRoom = async (req, res) => {
  const { roomId, username } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.players.includes(username)) {
      room.players.push(username);
      await room.save();
    }

    res.status(200).json({ message: "Joined room", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
