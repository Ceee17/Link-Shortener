const router = require("express").Router();
const passport = require("passport");
const {
  userCreateAccount,
  userLoginSubmit,
  getUserLoginViews,
  getUserViews,
  getAdminLoginViews,
  adminLoginSubmit,
  getAdminCreateAccountViews,
  adminCreateAccount,
  getAdminViews,
  getGoogleOAuth,
  getGoogleCallback,
  getUserCreateAccountViews,
} = require("../controller/authController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");
const { authGoogleMiddleware } = require("../middleware/authGoogleMiddleware");

// Route for initiating Google OAuth authentication
router.get("/auth/google", getGoogleOAuth);

// Callback route after Google authentication
router.get("/auth/google/callback", authGoogleMiddleware, getGoogleCallback);

router.post("/user/create-account/submit", userCreateAccount);
router.get("/user/create-account", getUserCreateAccountViews);
router.post("/user/login/submit", userLoginSubmit, (req, res) => {
  res.redirect("/" + req.user.username + "/dashboard");
});
router.get("/user/login", getUserLoginViews);
router.get("/:username/dashboard", getUserViews);
router.get("/admin/login", getAdminLoginViews);
router.post("/admin/login/submit", adminLoginSubmit);
router.get("/admin/create-account", getAdminCreateAccountViews);
router.post("/admin/create-account", adminCreateAccount);
router.get("/admin", isAdminAuthenticated, getAdminViews);
module.exports = router;
