const router = require("express").Router();
const { userLogout } = require("../controller/userController");

router.get("/user/logout", userLogout);

module.exports = router;
