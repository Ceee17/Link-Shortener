const router = require("express").Router();
const { getUserViews, userLogout, shortenUrlUser, getUserHistory, userUpdateData, userDeleteData } = require("../controller/userController");
const { isUserAuthenticated } = require("../middleware/authMiddleware");

router.get("/:username/dashboard", isUserAuthenticated, getUserViews);
router.post("/:username/dashboard/shorturl", isUserAuthenticated, shortenUrlUser);
router.get("/:username/history", isUserAuthenticated, getUserHistory);
router.post("/:username/update/:id", isUserAuthenticated, userUpdateData);
router.post("/:username/delete/:id", isUserAuthenticated, userDeleteData);
router.post("/user/logout", isUserAuthenticated, userLogout);

module.exports = router;
