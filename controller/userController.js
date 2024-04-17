const fetch = require("node-fetch");
const ShortUrl = require("../models/shortUrl");
const shortId = require("shortid");

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

  if (customShortId) {
    const existingShortUrl = await ShortUrl.findOne({ short: customShortId });
    if (existingShortUrl) {
      return res.status(400).send("Custom short ID already exists");
    }
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: customShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  } else {
    const generatedShortId = shortId.generate();
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: generatedShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  }

  // Send response with inserted data
  res.status(201).json({ message: "Short URL created successfully", shortUrl });
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

module.exports = { shortenUrlUser, userLogout };
