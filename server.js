const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const roomSocket = require("./socket/roomSocket");
const roomController = require("./controllers/roomController"); // ✅ Import roomController

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [
      "https://code-arena-three.vercel.app", // frontend
      "https://code-battle-backend-vq5s.onrender.com" // backend
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Make io available everywhere
app.set("io", io);

// ✅ Inject Socket.IO into roomController so it can emit events
roomController.injectSocket(io);

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://code-arena-three.vercel.app",
      "https://code-battle-backend-vq5s.onrender.com"
    ],
    credentials: true
  })
);

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://lpklpk:lpklpk@cluster0.zywog3z.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

// Socket connections
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  roomSocket(io, socket);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 4002;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
