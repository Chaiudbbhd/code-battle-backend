exports.createRoom = (req, res) => {
  const { roomId, host } = req.body;
  // Normally you’d save room to DB
  res.status(201).json({ message: 'Room created', roomId, host });
};

exports.joinRoom = (req, res) => {
  const { roomId, username } = req.body;
  // Normally you’d check if room exists
  res.status(200).json({ message: 'Joined room', roomId, username });
};
