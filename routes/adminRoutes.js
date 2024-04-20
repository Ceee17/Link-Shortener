const express = require("express");
const router = express.Router();
const { isAdminAuthenticated } = require("../middleware/authMiddleware");
const { adminSortData, adminSearchData, adminDeleteData, adminResetData, adminUpdateData, adminLogout, getAdminViews, adminFilterUsers } = require("../controller/adminController");

router.get("/admin", isAdminAuthenticated, getAdminViews);
router.get("/admin/sort/", isAdminAuthenticated, adminSortData);
router.get("/admin/search", isAdminAuthenticated, adminSearchData);
router.get("/admin/filter", isAdminAuthenticated, adminFilterUsers);
router.post("/admin/delete/:id", isAdminAuthenticated, adminDeleteData);
router.post("/admin/reset", isAdminAuthenticated, adminResetData);
router.post("/admin/update/:id", isAdminAuthenticated, adminUpdateData);
router.post("/admin/logout", isAdminAuthenticated, adminLogout);

module.exports = router;
