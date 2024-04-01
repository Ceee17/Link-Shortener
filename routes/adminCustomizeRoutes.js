const router = require("express").Router();
const { getAdminCustomizeViews } = require("../controller/adminCustomizeController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

router.get("/admin/customize", isAdminAuthenticated, getAdminCustomizeViews);

module.exports = router;
