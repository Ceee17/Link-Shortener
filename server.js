// ./server.js
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const ShortUrl = require("./models/shortUrl");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initialize express session and flash
app.use(
  session({
    secret: "rahasia",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

require("./passport-config");

app.set("view engine", "ejs");
app.use(expressLayouts);
// app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes for authentication
const authController = require("./controller/authController");
const adminController = require("./controller/adminController");
const shortUrlController = require("./controller/shortUrlController");

// Render the index page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { layout: "layouts/main-layout", title: "Snipify", showShortenedLink: false, shortUrls: shortUrls });
});

app.use("/", authController);

app.use("/", adminController);

app.use("/", shortUrlController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
