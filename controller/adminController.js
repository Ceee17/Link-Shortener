// ./controller/adminController.js
const express = require("express");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model

// Add a route to handle delete requests
const adminDeleteData = async (req, res) => {
  try {
    await ShortUrl.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send("Error deleting URL");
  }
};

const adminResetData = async (req, res) => {
  await ShortUrl.deleteMany({});
  res.redirect("/admin");
};

// Route to handle update operation
const adminUpdateData = async (req, res) => {
  const { id } = req.params;
  const { fullUrl, shortUrl, clicks } = req.body;

  try {
    // Find the URL document by ID
    const url = await ShortUrl.findById(id);

    // Update the URL properties
    url.full = fullUrl;
    url.short = shortUrl;
    url.clicks = clicks;

    // Save the updated URL document
    await url.save();

    // Redirect back to the admin page
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating URL");
  }
};

// Example logout route handler
const adminLogout = (req, res) => {
  // Perform logout procedure
  // For example, clear session or authentication tokens
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      // Redirect to index page after logout
      res.redirect("/");
    }
  });
};

module.exports = { adminDeleteData, adminResetData, adminUpdateData, adminLogout };
