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
const authRoutes = require("./controller/authController");
const adminController = require("./controller/adminController");
const shortUrlController = require("./controller/shortUrlController");

// Render the index page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { layout: "layouts/main-layout", title: "Snipify", showShortenedLink: false, shortUrls: shortUrls });
});

app.use("/", authRoutes);

app.use("/", adminController);

app.use("/", shortUrlController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`); 
});

// Add a route to handle delete requests
app.post("/admin/delete/:id", async (req, res) => {
  try {
    await ShortUrl.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send("Error deleting URL");
  }
});

app.post("/admin/reset", async (req, res) => {
  await ShortUrl.deleteMany({});
  res.redirect("/admin");
});

// Route to handle update operation
app.post("/admin/update/:id", async (req, res) => {
  const { id } = req.params;
  const { fullUrl, shortUrl, clicks } = req.body;

  try {
    // Find the URL document by ID
    const url = await ShortUrl.findById(id);

    // Update the URL properties
    url.full = fullUrl;
    url.short = shortUrl;
    url.clicks = clicks;

    // Save the updated URL document
    await url.save();

    // Redirect back to the admin page
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating URL");
  }
});

app.post("/shortUrl", async (req, res) => {
  let createdBy;
  // const userId = req.user.id;

  if (req.user) {
    createdBy = req.user.username;
  }

  //TODO buat input field di frontend nya
  const customShortId = req.body.customShortId; // Assuming you have a form field for custom short ID
  let shortUrl;

  if (customShortId) {
    const existingShortUrl = await ShortUrl.findOne({ short: customShortId });
    if (existingShortUrl) {
      return res.status(400).send("Custom short ID already exists");
    }
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: customShortId });
  } else {
    const generatedShortId = shortId.generate();
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: generatedShortId, createdBy: createdBy });
  }

  res.render("index", { layout: "layouts/main-layout", title: "Snipify", showShortenedLink: true, shortUrls: [shortUrl] });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
