// server.js
const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();

mongoose.connect("mongodb://localhost/linkShortener", {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { showShortenedLink: false, shortUrls: shortUrls });
});

app.post("/admin/reset", async (req, res) => {
  await ShortUrl.deleteMany({});
  res.redirect("/admin");
});

app.get("/admin", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("admin", { shortUrls: shortUrls });
});
app.post("/shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.create({ full: req.body.fullUrl });
  res.render("index", { showShortenedLink: true, shortUrls: [shortUrl] });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);

console.log("App Running at http://localhost:5000");
