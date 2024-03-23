// ./server.js
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const ShortUrl = require("./models/shortUrl");
const shortId = require("shortid");
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/linkShortener", {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(expressLayouts);
// app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));

// Render the index page
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { layout: "layouts/main-layout", title: "Snipify", target: "/admin", showShortenedLink: false, shortUrls: shortUrls });
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

app.get("/admin", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("admin", { layout: "layouts/main-layout", title: "Admin Section", target: "/", shortUrls: shortUrls });
});

app.post("/shortUrl", async (req, res) => {
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
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: generatedShortId });
  }

  res.render("index", { layout: "layouts/main-layout", title: "Snipify", target: "/admin", showShortenedLink: true, shortUrls: [shortUrl] });
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
