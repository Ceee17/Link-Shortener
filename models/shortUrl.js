// ./models/shortUrl.js

const mongoose = require("mongoose");
// const shortId = require("shortid");

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
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
