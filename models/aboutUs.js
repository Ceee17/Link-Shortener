// models/aboutus.js
const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  content: { type: String, default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius dolor vitae nulla rhoncus blandit." },
});

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
