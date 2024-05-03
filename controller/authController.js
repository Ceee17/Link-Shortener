// ./controller/authController.js
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const getGoogleOAuth = passport.authenticate("google", { scope: ["profile"] });

const getGoogleCallback = async (req, res) => {
  try {
    const username = req.user.username;
    // Find the user in the database and update isGoogleAuth to true
    const user = await User.findOneAndUpdate(
      { username: username },
      { isGoogleAuth: true },
      { new: true } // To return the updated user object
    );
    if (!user) {
      // Handle case where user is not found
      return res.status(404).send("User not found");
    }

    // Redirect user after successful authentication
    res.redirect(`/${username}/dashboard`);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).send("Internal Server Error!");
  }
};

const userCreateAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send(`<script>alert('Username Already Exists!'); window.location.href = '/user/create-account';</script>`);
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
    res.send(`<script>alert('Account Created Successfully'); window.location.href = '/user/login';</script>`);
  } catch (error) {
    console.error("Error creating user account:", error);
    res.status(500).send(`<script>alert('Error Creating User Account!'); window.location.href = '/user/create-account';</script>`);
  }
};

const getUserCreateAccountViews = (req, res) => {
  res.render("user-signup", { layout: "layouts/form-layout", title: "User Create Account Page" });
};

const userLoginSubmit = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle internal server error
      console.error("Error authenticating user:", err);
      return res.status(500).send(`<script>alert('Error Authenticating User Account!'); window.location.href = '/user/login';</script>`);
    }
    if (!user) {
      // Authentication failed, provide failure message
      const errorMessage = JSON.stringify(info.message); // Convert error message to JSON string
      const script = `<script>alert(\`ERROR: ${errorMessage}\`); window.location.href = '/user/login';</script>`;
      return res.status(400).send(script);
    }

    // Authentication successful, proceed with login
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error logging in user:", err);
        return res.status(500).send(`<script>alert('Error Authenticating User Account!'); window.location.href = '/user/login';</script>`);
      }
      // Redirect to success page or send success response
      return res.status(200).send(`<script>alert('LOGIN SUCCESSFULL, REDIRECTING NOW!'); window.location.href = \`/${user.username}/dashboard\`</script>`);
    });
  })(req, res, next);
};

const getUserLoginViews = (req, res) => {
  res.render("user-login", { layout: "layouts/form-layout", title: "User Login Page" });
};

const getAdminLoginViews = (req, res) => {
  res.render("admin-login", { layout: "layouts/form-layout", title: "Login Page" });
};

const adminLoginSubmit = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Handle internal server error
      console.error("Error authenticating admin:", err);
      return res.status(500).send(`<script>alert('Error Authenticating Admin Account!'); window.location.href = '/admin/login';</script>`);
    }
    if (!user) {
      // Authentication failed, provide failure message
      const errorMessage = JSON.stringify(info.message); // Convert error message to JSON string
      const script = `<script>alert(\`ERROR: ${errorMessage}\`); window.location.href = '/admin/login';</script>`;
      return res.status(400).send(script);
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      // User is not an admin, provide appropriate error message
      const errorMessage = "Only admin accounts are allowed to access the admin dashboard";
      const script = `<script>alert(\`ERROR: ${errorMessage}\`); window.location.href = '/admin/login';</script>`;
      return res.status(403).send(script);
    }

    // Authentication successful, proceed with login
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error logging in admin:", err);
        return res.status(500).send(`<script>alert('Error Authenticating Admin Account!'); window.location.href = '/admin/login';</script>`);
      }
      // Send success response
      return res.status(200).send(`<script>alert('Login successful!'); window.location.href = '/admin';</script>`);
    });
  })(req, res, next);
};

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
    res.status(201).send(`<script>alert('Admin Created Account Successfully'); window.location.href = '/admin/login';</script>`);
  } catch (error) {
    console.error("Error creating admin account:", error);
    res.status(500).send("Error creating admin account");
  }
};

module.exports = {
  getGoogleOAuth,
  getGoogleCallback,
  userCreateAccount,
  getUserCreateAccountViews,
  userLoginSubmit,
  getUserLoginViews,
  getAdminLoginViews,
  adminLoginSubmit,
  getAdminCreateAccountViews,
  adminCreateAccount,
};
