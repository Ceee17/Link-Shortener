// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String }, //buat local strategy
  googleId: { type: String }, // buat Google authentication
  isGoogleAuth: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
