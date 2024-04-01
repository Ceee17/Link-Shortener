const router = require("express").Router();
const { getUserViews, getAdminLoginViews, adminLoginSubmit, getAdminCreateAccountViews, adminCreateAccount, getAdminViews } = require("../controller/authController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

router.get("user", getUserViews);
router.get("/admin/login", getAdminLoginViews);
router.post("/admin/login/submit", adminLoginSubmit);
router.get("/admin/create-account", getAdminCreateAccountViews);
router.post("/admin/create-account", adminCreateAccount);
router.get("/admin", isAdminAuthenticated, getAdminViews);
module.exports = router;
