const fetch = require("node-fetch");
const ShortUrl = require("../models/shortUrl");
const shortId = require("shortid");

const getUserViews = (req, res) => {
  const username = req.params.username;
  res.render("dashboard", { layout: "layouts/user-layout", title: "User Dashboard", username: username });
};

// Server-side handling (shortenUrlUser controller function)
const shortenUrlUser = async (req, res) => {
  let createdBy;
  // const aboutUs = await AboutUs.findOne();
  const description = req.body.description;

  if (req.user) {
    createdBy = req.user.username;
  }

  //TODO buat input field di frontend nya
  const customShortId = req.body.customShortId; // Assuming you have a form field for custom short ID
  let shortUrl;

  // Validate input URL format using regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(\/[^\s]*)?$/i;
  if (!urlRegex.test(req.body.fullUrl)) {
    return res.status(400).json({ message: "Please enter a valid URL." });
  }

  if (customShortId) {
    const existingShortUrl = await ShortUrl.findOne({ short: customShortId });
    if (existingShortUrl) {
      return res.status(400).json({ message: "Custom URL already exists." });
    }
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: customShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  } else {
    const generatedShortId = shortId.generate();
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: generatedShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  }

  // Send response with inserted data
  res.status(201).json({ message: "Short URL created successfully", shortUrl });
};

getUserHistory = async (req, res) => {
  try {
    const username = req.params.username; // Assuming the username is passed as a route parameter
    const shortUrls = await ShortUrl.find({ createdBy: username });

    // Reverse the array to display the newest short URLs at the top
    shortUrls.reverse();

    res.render("user-history", { layout: "layouts/user-layout", title: "User History", username: username, shortUrls });
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).send("Internal Server Error");
  }
};

// controller to handle delete requests
const userDeleteData = async (req, res) => {
  try {
    const username = req.user.username;
    await ShortUrl.findByIdAndDelete(req.params.id);
    res.redirect(`/${username}/history`);
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send("Error deleting URL");
  }
};

// controller to handle update operation
const userUpdateData = async (req, res) => {
  const { id, username } = req.params;
  const { description, fullUrl, shortUrl, clicks } = req.body;

  try {
    // Find the URL document by ID
    const url = await ShortUrl.findById(id);

    // Check if the shortUrl is already in use by another document
    const existingUrl = await ShortUrl.findOne({ short: shortUrl });
    if (existingUrl && existingUrl._id.toString() !== id) {
      // If a document with the same shortUrl exists and it's not the current document being updated, it's a duplicate
      // return res.status(400).json({ message: "Short URL already in use. Please choose a different one." });
      alert("Short URL already in use. Please choose a different one.");
    }

    // Update the URL properties
    if ((description !== undefined && description != null) || description !== "none") {
      url.description = description;
    }
    if (fullUrl !== undefined) {
      url.full = fullUrl;
    }
    if (shortUrl !== undefined) {
      url.short = shortUrl;
    }
    if (clicks !== undefined) {
      url.clicks = clicks;
    }

    // Save the updated URL document
    await url.save();

    // Redirect back to the admin page
    res.redirect(`/${username}/history`);
    // res.status(201).json({ message: "URL Updated Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating URL");
  }
};

// Disini kita pakai revoke url karna alasan keamanan,
// untuk menjamin keamanan token user, maka harus direvoke dulu
userLogout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.redirect("/"); // Redirect to the homepage or any other desired URL
    } else {
      // Revoke the access token if it exists
      if (req.user && req.user.accessToken) {
        const accessToken = req.user.accessToken;
        const clientId = process.env.GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // Replace with your Google OAuth client secret

        const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}&client_id=${clientId}&client_secret=${clientSecret}`;

        fetch(revokeUrl, {
          method: "POST",
        })
          .then((response) => {
            if (response.ok) {
              console.log("Access token revoked successfully");
            } else {
              console.error("Failed to revoke access token");
            }
          })
          .catch((error) => {
            console.error("Error revoking access token:", error);
          });
      }

      res.redirect("/"); // Redirect to the homepage or any other desired URL
    }
  });
};

module.exports = { getUserViews, shortenUrlUser, getUserHistory, userDeleteData, userUpdateData, userLogout };
