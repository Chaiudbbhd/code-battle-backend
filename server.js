const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");

const app = express();

// Basic request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://code-arena-three.vercel.app", // Frontend URL
    credentials: true,
  })
);

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://lpklpk:lpklpk@cluster0.zywog3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

// Test route
app.get("/test", (req, res) => {
  res.send("Test route works!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
