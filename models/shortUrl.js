// ./models/shortUrl.js

const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    // default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    default: "none",
  },

  createdBy: { type: String, default: "guest" },
  dateAdded: {
    type: Date,
    default: Date.now, // Automatically generate the current timestamp
    immutable: true, // Ensure the field is immutable once set
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
