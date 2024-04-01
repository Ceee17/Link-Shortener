const router = require("express").Router();
const { getAdminUsersViews } = require("../controller/adminUsersController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

router.get("/admin/users", isAdminAuthenticated, getAdminUsersViews);

module.exports = router;
