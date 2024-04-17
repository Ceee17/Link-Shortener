// ./controller/authController.js
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model
const User = require("../models/user");

const getGoogleOAuth = passport.authenticate("google", { scope: ["profile"] });

const getGoogleCallback = (req, res) => {
  const username = req.user.username;
  // Redirect user after successful authentication
  res.redirect(`/${username}/dashboard`);
};

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
    res.redirect("/user/login");
  } catch (error) {
    console.error("Error creating user account:", error);
    res.status(500).send("Error creating user account");
  }
};

const getUserCreateAccountViews = (req, res) => {
  res.render("user-signup", { layout: "layouts/form-layout", title: "User Create Account Page" });
};

const userLoginSubmit = passport.authenticate("local", {
  failureRedirect: "/user/login",
});

const getUserLoginViews = (req, res) => {
  res.render("user-login", { layout: "layouts/form-layout", title: "User Login Page" });
};

const getUserViews = (req, res) => {
  const username = req.params.username;
  res.render("dashboard", { layout: "layouts/admin-layout", title: "User Dashboard", username: username });
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
  try {
    const shortUrls = await ShortUrl.find();
    res.render("admin", { layout: "layouts/admin-layout", title: "Admin Section", shortUrls: shortUrls });
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    res.status(500).send("Error fetching short URLs");
  }
};

module.exports = {
  getGoogleOAuth,
  getGoogleCallback,
  userCreateAccount,
  getUserCreateAccountViews,
  userLoginSubmit,
  getUserLoginViews,
  getUserViews,
  getAdminLoginViews,
  adminLoginSubmit,
  getAdminCreateAccountViews,
  adminCreateAccount,
  getAdminViews,
};
