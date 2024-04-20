const bcrypt = require("bcrypt");
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

// Route to handle update operation
const adminUsersUpdateData = async (req, res) => {
  const { id } = req.params;
  const { username, password, isAdmin } = req.body;

  try {
    // Find the URL document by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the URL properties
    user.username = username;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isAdmin = isAdmin;

    // Save the updated URL document
    await user.save();

    // Redirect back to the admin page
    res.redirect(`/admin/users`);
    // res.status(201).json({ message: "URL Updated Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating URL");
  }
};

// Add a controller to handle delete requests
const adminUsersDeleteData = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/users`);
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send("Error deleting URL");
  }
};

const adminUsersCreateData = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user in the database
    const newUser = new User({
      username: username,
      password: hashedPassword, // Make sure to hash the password before saving it in the database
      isAdmin: isAdmin === "true" ? true : false,
    });

    await newUser.save();

    res.redirect("/admin/users"); // Redirect back to admin users view after user creation
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAdminUsersViews, adminUsersUpdateData, adminUsersDeleteData, adminUsersCreateData };
