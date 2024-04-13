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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./passport-config");

app.set("view engine", "ejs");
app.use(expressLayouts);
// app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Require the middleware
const ensureAboutUsExists = require("./middleware/ensureAboutUsExists");
// middleware utk mastiin aboutus content itu ada, kalo gada create dlu nilai defaultnya
app.use(ensureAboutUsExists);

const authRoutes = require("./routes/authRoutes");
const adminUsersRoutes = require("./routes/adminUsersRoutes");
const adminCustomizeRoutes = require("./routes/adminCustomizeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const shortUrlRoutes = require("./routes/shortUrlRoutes");

// Render the index page
app.get("/", async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    const shortUrls = await ShortUrl.find();

    res.render("index", { layout: "layouts/main-layout", title: "Snipify", aboutUsContent: aboutUs.content, showShortenedLink: false, shortUrls: shortUrls });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    // Handle errors appropriately
    res.status(500).send("Internal Server Error");
  }
});

app.use("/", authRoutes);

app.use("/", adminUsersRoutes);
app.use("/", adminCustomizeRoutes);

app.use("/", adminRoutes);

app.use("/", shortUrlRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
