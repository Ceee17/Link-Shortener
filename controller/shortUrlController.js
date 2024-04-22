// ./controller/shortUrlController.js
const express = require("express");
const ShortUrl = require("../models/shortUrl"); // Import ShortUrl model
const AboutUs = require("../models/aboutUs"); // Import ShortUrl model
const shortId = require("shortid");

const shortenUrl = async (req, res) => {
  let createdBy;
  const aboutUs = await AboutUs.findOne();
  const description = req.body.description;

  if (req.user) {
    createdBy = req.user.username;
  }

  // TODO buat input field di frontend nya

  const customShortId = req.body.customShortId; // Assuming you have a form field for custom short ID
  let shortUrl;
  // Validate input URL format using regex
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(\/[^\s]*)?$/i;
  if (!urlRegex.test(req.body.fullUrl)) {
    return res.status(400).json({ message: "Please enter a valid URL." });
  }

  if (customShortId) {
    const existingShortUrl = await ShortUrl.findOne({ short: customShortId });
    if (existingShortUrl) {
      return res.status(400).send("Custom short ID already exists");
    }
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: customShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  } else {
    const generatedShortId = shortId.generate();
    shortUrl = await ShortUrl.create({ full: req.body.fullUrl, short: generatedShortId, description: description, createdBy: createdBy, dateAdded: Date.now() });
  }

  res.render("index", { layout: "layouts/main-layout", title: "Snipify", aboutUsContent: aboutUs.content, showShortenedLink: true, shortUrls: [shortUrl] });
};

const getShortenedUrl = async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  // window.location.reload();

  res.redirect(shortUrl.full);

  // Send a script to the client to redirect and reload the page after a delay
  // res.write(`<script>window.location.href = "${shortUrl.full}"; setTimeout(function(){ window.location.reload(); }, 10000);</script>`);
  // res.end();
};

module.exports = { shortenUrl, getShortenedUrl };
