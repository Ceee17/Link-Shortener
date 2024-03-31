const express = require("express");
const router = express.Router();
const { shortenUrl, getShortenedUrl } = require("../controller/shortUrlController");

router.post("/shortUrl", shortenUrl);

router.get("/:shortUrl", getShortenedUrl);

module.exports = router;
