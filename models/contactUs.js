// models/contactUs.js
const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  address: { type: String, default: "123 Main Street, City, Country" },
  email: { type: String, default: "info@example.com" },
  phoneNumber: { type: String, default: "+62 812 3456 7890" },
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
