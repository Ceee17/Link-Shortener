// ./controller/authController.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model
const User = require("../models/user");

router.get("/user", (req, res) => {
  res.send("ok");
});

router.get("/admin/login", (req, res) => {
  res.render("admin-login", { layout: "layouts/form-layout", title: "Login Page" });
});

router.post(
  "/admin/login/submit",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true, // Enable flash messages for failure
    successFlash: "Login successful!", // Flash message for successful login
  })
);

router.get("/admin/create-account", (req, res) => {
  res.render("admin-signup", { layout: "layouts/form-layout", title: "admin create account" });
});
// Route for creating admin accounts (accessible to anyone)
router.post("/admin/create-account", async (req, res) => {
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
});

router.get("/admin", isAdminAuthenticated, async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("admin", { layout: "layouts/admin-layout", title: "Admin Section", shortUrls: shortUrls });
});

// Middleware to check if user is an admin
function isAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = router;
