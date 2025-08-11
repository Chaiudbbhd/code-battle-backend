const { flagCheating } = require('../utils/cheatDetector');

module.exports = (io, socket) => {
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { username });
    console.log(`${username} joined room ${roomId}`);
  });

  socket.on('leave-room', ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { username });
    console.log(`${username} left room ${roomId}`);
  });

  socket.on('code-submit', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', { code });
  });

  // 🛡️ Cheat detection
  socket.on('cheat-detected', ({ userId, reason }) => {
    flagCheating(userId, reason);

    // Optional: Disconnect or notify others
    socket.to(socket.rooms).emit('user-disqualified', { userId, reason });
    socket.disconnect(true);
  });
};
