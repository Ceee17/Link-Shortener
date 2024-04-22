const AboutUs = require("../models/aboutUs");
const ContactUs = require("../models/contactUs");
const getAdminCustomizeViews = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    const contactUs = await ContactUs.findOne();
    res.render("customize", { layout: "layouts/admin-layout", title: "Customize About Us", aboutUs, contactUs });
  } catch (error) {
    console.error("Error fetching Data description:", error);
    res.status(500).send("Error fetching Data description");
  }
};

// Controller method to update the About Us description
// Controller method to update the About Us description
const updateAboutUs = async (req, res) => {
  const { content } = req.body;

  try {
    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUs({ content });
    } else {
      aboutUs.content = content;
    }
    await aboutUs.save();

    // Send a success response to the client
    res.status(200).json({ message: "About Us description updated successfully" });
  } catch (error) {
    console.error("Error updating About Us description:", error);
    res.status(500).json({ error: "Error updating About Us description" });
  }
};

const updateContactUs = async (req, res) => {
  const { address, email, phoneNumber } = req.body;

  try {
    let contactUs = await ContactUs.findOne();
    if (!contactUs) {
      contactUs = new ContactUs({ address, email, phoneNumber });
    } else {
      contactUs.address = address;
      contactUs.email = email;
      contactUs.phoneNumber = phoneNumber;
    }
    await contactUs.save();

    // Send a success response to the client
    res.status(200).json({ message: "Contact Us description updated successfully" });
  } catch (err) {
    console.error("Error updating Contact Us description:", err);
    res.status(500).json({ err: "Error updating Contact Us description" });
  }
};

module.exports = { getAdminCustomizeViews, updateAboutUs, updateContactUs };
