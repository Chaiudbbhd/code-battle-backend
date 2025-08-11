const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [{ type: String }], // store usernames
  status: { type: String, enum: ["waiting", "in-progress", "finished"], default: "waiting" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", roomSchema);
