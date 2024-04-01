const express = require("express");
const User = require("../models/user");
// Route to display users section in admin page
const getAdminUsersViews = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.render("show-users", { layout: "layouts/admin-layout", title: "Admin Section", users: users }); // Pass the users data to the template
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

module.exports = { getAdminUsersViews };
