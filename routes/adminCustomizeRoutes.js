const router = require("express").Router();
const { getAdminCustomizeViews, updateAboutUs, updateContactUs } = require("../controller/adminCustomizeController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");
const { ensureAboutUsExists } = require("../middleware/ensureAboutUsExists");
const { ensureContactUsExists } = require("../middleware/ensureContactUsExists");

router.get("/admin/customize", isAdminAuthenticated, getAdminCustomizeViews);
router.post("/admin/customize/update", updateAboutUs);
router.post("/admin/customize/contact-us", updateContactUs);

module.exports = router;
