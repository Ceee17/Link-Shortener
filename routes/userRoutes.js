const router = require("express").Router();
const { userLogout, shortenUrlUser } = require("../controller/userController");

router.post("/:username/dashboard/shorturl", shortenUrlUser);
router.post("/user/logout", userLogout);

module.exports = router;
