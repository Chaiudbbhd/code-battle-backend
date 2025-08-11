const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Dashboard: Get all rooms
router.get("/", roomController.getAllRooms);

// Create and Join rooms
router.post("/create", roomController.createRoom);
router.post("/join", roomController.joinRoom);

module.exports = router;
