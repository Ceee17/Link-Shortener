// ./controller/authController.js
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model
const User = require("../models/user");

const userCreateAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      isAdmin: false, // Not an admin
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).send("User account created successfully");
  } catch (error) {
    console.error("Error creating user account:", error);
    res.status(500).send("Error creating user account");
  }
};

const getUserCreateAccountViews = (req, res) => {
  res.render("user-signup", { layout: "layouts/form-layout", title: "User Create Account Page" });
};

const userLoginSubmit = passport.authenticate("local", {
  successRedirect: "/user/dashboard",
  failureRedirect: "/user/login",
  failureFlash: true,
  successFlash: "Login successful!",
});

const getUserLoginViews = (req, res) => {
  res.render("user-login", { layout: "layouts/form-layout", title: "User Login Page" });
};

const getUserViews = (req, res) => {
  const username = req.params.username;
  res.render("dashboard", { layout: false, username: username });
};

const getAdminLoginViews = (req, res) => {
  res.render("admin-login", { layout: "layouts/form-layout", title: "Login Page" });
};

const adminLoginSubmit = passport.authenticate("local", {
  successRedirect: "/admin",
  failureRedirect: "/admin/login",
  failureFlash: true, // Enable flash messages for failure
  successFlash: "Login successful!", // Flash message for successful login
});

const getAdminCreateAccountViews = (req, res) => {
  res.render("admin-signup", { layout: "layouts/form-layout", title: "admin create account" });
};
// Route for creating admin accounts (accessible to anyone)
const adminCreateAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newUser = new User({
      username,
      password: hashedPassword, // Store the hashed password in the database
      isAdmin: true,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).send("Admin account created successfully");
  } catch (error) {
    console.error("Error creating admin account:", error);
    res.status(500).send("Error creating admin account");
  }
};

const getAdminViews = async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("admin", { layout: "layouts/admin-layout", title: "Admin Section", shortUrls: shortUrls });
};

module.exports = { userLoginSubmit, getUserLoginViews, getUserViews, getAdminLoginViews, adminLoginSubmit, getAdminCreateAccountViews, adminCreateAccount, getAdminViews };
