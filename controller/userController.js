const fetch = require("node-fetch");
// Route for logging out
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

module.exports = { userLogout };
