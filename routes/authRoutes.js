const router = require("express").Router();
const {
  userCreateAccount,
  userLoginSubmit,
  getUserLoginViews,
  getAdminLoginViews,
  adminLoginSubmit,
  getAdminCreateAccountViews,
  adminCreateAccount,
  getGoogleOAuth,
  getGoogleCallback,
  getUserCreateAccountViews,
} = require("../controller/authController");
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
router.get("/admin/login", getAdminLoginViews);
router.post("/admin/login/submit", adminLoginSubmit);
router.get("/admin/create-account", getAdminCreateAccountViews);
router.post("/admin/create-account", adminCreateAccount);
module.exports = router;
