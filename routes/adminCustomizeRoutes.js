const router = require("express").Router();
const { getAdminCustomizeViews, updateAboutUs } = require("../controller/adminCustomizeController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

router.get("/admin/customize", isAdminAuthenticated, getAdminCustomizeViews);
router.post("/admin/customize/update", updateAboutUs);

module.exports = router;
