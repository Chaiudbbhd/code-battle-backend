const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String }, // for local login
  avatar: String
});

module.exports = mongoose.model('User', userSchema);
