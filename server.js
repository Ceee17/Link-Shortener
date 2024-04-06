// ./server.js
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const ShortUrl = require("./models/shortUrl");
const AboutUs = require("./models/aboutUs");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: true,
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

const authRoutes = require("./routes/authRoutes");
const adminUsersRoutes = require("./routes/adminUsersRoutes");
const adminCustomizeRoutes = require("./routes/adminCustomizeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shortUrlRoutes = require("./routes/shortUrlRoutes");

// Render the index page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();

  res.render("index", { layout: "layouts/main-layout", title: "Snipify", showShortenedLink: false, shortUrls: shortUrls });
});

app.use("/", authRoutes);

app.use("/", adminUsersRoutes);
app.use("/", adminCustomizeRoutes);

app.use("/", adminRoutes);

app.use("/", shortUrlRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
