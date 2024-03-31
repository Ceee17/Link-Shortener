// ./controller/shortUrlController.js
const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model
const shortId = require("shortid");

router.post("/shortUrl", async (req, res) => {
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

router.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

module.exports = router;