const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const roomSocket = require("./socket/roomSocket");
const roomController = require("./controllers/roomController"); // ⬅ Added import

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://code-arena-three.vercel.app",
      "https://code-battle-backend-vq5s.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Pass io to roomController so it can emit events
roomController.injectSocket(io);

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cors({
  origin: [
    "https://code-arena-three.vercel.app",
    "https://<your-render-backend-url>.onrender.com"
  ],
  credentials: true
}));

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://lpklpk:lpklpk@cluster0.zywog3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
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

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
});

// Initialize sockets
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  roomSocket(io, socket); // Pass io + socket to roomSocket.js

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 4002;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
