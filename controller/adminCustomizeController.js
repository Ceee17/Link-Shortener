const AboutUs = require("../models/aboutUs");
const getAdminCustomizeViews = async (req, res) => {
  res.render("customize", { layout: "layouts/admin-layout", title: "Customize Section", AboutUs });
};

module.exports = { getAdminCustomizeViews };
