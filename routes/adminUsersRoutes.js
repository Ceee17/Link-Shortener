const router = require("express").Router();
const { getAdminUsersViews, adminUsersUpdateData, adminUsersDeleteData, adminUsersCreateData } = require("../controller/adminUsersController");
const { isAdminAuthenticated } = require("../middleware/authMiddleware");

router.get("/admin/users", isAdminAuthenticated, getAdminUsersViews);
router.post("/admin/users/update/:id", isAdminAuthenticated, adminUsersUpdateData);
router.post("/admin/users/delete/:id", isAdminAuthenticated, adminUsersDeleteData);
router.post("/admin/users/create", isAdminAuthenticated, adminUsersCreateData);

module.exports = router;
