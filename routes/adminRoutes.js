const express = require("express");
const router = express.Router();
const { adminDeleteData, adminResetData, adminUpdateData, adminLogout } = require("../controller/adminController");

router.post("/admin/delete/:id", adminDeleteData);
router.post("/admin/reset", adminResetData);
router.post("/admin/update/:id", adminUpdateData);
router.post("/admin/logout", adminLogout);

module.exports = router;
