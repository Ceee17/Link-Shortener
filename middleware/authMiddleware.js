// middleware/authMiddleware.js
function isAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = { isAdminAuthenticated };
