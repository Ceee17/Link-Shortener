// ./controller/adminController.js
const express = require("express");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model

// define a controller to handle sorting
const adminSortData = async (req, res) => {
  const { sortBy } = req.query;
  let shortUrls;

  try {
    switch (sortBy) {
      case "fullUrl":
      case "shortUrl":
      case "description":
      case "createdBy":
        shortUrls = await ShortUrl.find().sort({ [sortBy]: 1 });
        break;
      case "clicks":
        shortUrls = await ShortUrl.find().sort({ clicks: -1 });
        break;
      case "dateAdded":
        shortUrls = await ShortUrl.find().sort({ dateAdded: -1 });
        break;
      default:
        shortUrls = await ShortUrl.find();
    }

    // Render the sorted data
    res.render("layouts/table-body", { layout: false, shortUrls });
  } catch (err) {
    console.error("Error sorting URLs:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Define a controller to handle search requests
const adminSearchData = async (req, res) => {
  try {
    // Get the search query from the request parameters
    const query = req.query.query;

    // Search for shortUrls that match the query
    const shortUrls = await ShortUrl.find({
      $or: [
        { full: { $regex: query, $options: "i" } }, // Case-insensitive search for full URL
        { short: { $regex: query, $options: "i" } }, // Case-insensitive search for short URL
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search for description
        { createdBy: { $regex: query, $options: "i" } }, // Case-insensitive search for createdBy
      ],
    });

    // Render the admin page with the search results
    res.render("admin", { layout: "layouts/admin-layout", title: "Admin Section", shortUrls: shortUrls });
  } catch (error) {
    console.error("Error searching for shortUrls:", error);
    res.status(500).send("Error searching for shortUrls");
  }
};

// Add a controller to handle delete requests
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

module.exports = { adminSortData, adminSearchData, adminDeleteData, adminResetData, adminUpdateData, adminLogout };
