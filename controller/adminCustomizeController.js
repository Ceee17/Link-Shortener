const AboutUs = require("../models/aboutUs");
const getAdminCustomizeViews = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    res.render("customize", { layout: "layouts/admin-layout", title: "Customize About Us", aboutUs });
  } catch (error) {
    console.error("Error fetching About Us description:", error);
    res.status(500).send("Error fetching About Us description");
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

module.exports = { getAdminCustomizeViews, updateAboutUs };
