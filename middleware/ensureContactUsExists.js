// ./middleware/ensureAboutUsExists.js
const ContactUs = require("../models/contactUs");

// Middleware to ensure AboutUs document exists
const ensureContactUsExists = async (req, res, next) => {
  try {
    // Check if AboutUs document exists
    let contactUs = await ContactUs.findOne();

    // If no document exists, create one with default content
    if (!contactUs) {
      // set default value buat about us disni, disini terjadi operasi create
      contactUs = await ContactUs.create({ address: "123 Main Street, City, Country", email: "info@example.com", phoneNumber: "+62 812 3456 7890" });
    }

    // Make the contactUs document available in the request object
    req.contactUs = contactUs;

    next();
  } catch (error) {
    console.error("Error fetching ContactUs document:", error);
    // Handle the error appropriately, such as rendering an error page
    res.status(500).send("Error fetching ContactUs content");
  }
};

module.exports = ensureContactUsExists;
