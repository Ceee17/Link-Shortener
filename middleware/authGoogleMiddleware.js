// middleware/passportMiddleware.js

const passport = require("passport");

const authGoogleMiddleware = passport.authenticate("google", { failureRedirect: "/" });

module.exports = {
  authGoogleMiddleware,
};
