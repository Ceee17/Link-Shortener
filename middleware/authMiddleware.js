// middleware/authMiddleware.js
function isAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect("/admin/login");
}

function isUserAuthenticated(req, res, next) {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  }
  res.redirect("/user/login"); // Redirect to login page if user is not authenticated
}

module.exports = { isAdminAuthenticated, isUserAuthenticated };
