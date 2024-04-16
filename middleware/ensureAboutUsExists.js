// ./middleware/ensureAboutUsExists.js
const AboutUs = require("../models/aboutUs");

// Middleware to ensure AboutUs document exists
const ensureAboutUsExists = async (req, res, next) => {
  try {
    // Check if AboutUs document exists
    let aboutUs = await AboutUs.findOne();

    // If no document exists, create one with default content
    if (!aboutUs) {
      // set default value buat about us disni, disini terjadi operasi create
      aboutUs = await AboutUs.create({ content: "Content ini merupakan nilai default dari middleware silahkan mengubahnya pada admin section" });
    }

    // Make the aboutUs document available in the request object
    req.aboutUs = aboutUs;

    next();
  } catch (error) {
    console.error("Error fetching AboutUs document:", error);
    // Handle the error appropriately, such as rendering an error page
    res.status(500).send("Error fetching AboutUs content");
  }
};

module.exports = ensureAboutUsExists;
