const router = require("express").Router();
const passport = require("passport");
const { getUserViews, getAdminLoginViews, adminLoginSubmit, getAdminCreateAccountViews, adminCreateAccount, getAdminViews } = require("../controller/authController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

// Route for initiating Google OAuth authentication
router.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

// Callback route after Google authentication
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  const username = req.user.username;
  // Redirect user after successful authentication
  res.redirect(`/${username}/dashboard`);
});
router.get("/:username/dashboard", getUserViews);
router.get("/admin/login", getAdminLoginViews);
router.post("/admin/login/submit", adminLoginSubmit);
router.get("/admin/create-account", getAdminCreateAccountViews);
router.post("/admin/create-account", adminCreateAccount);
router.get("/admin", isAdminAuthenticated, getAdminViews);
module.exports = router;
