const express = require("express");
const router = express.Router();
const { generateAstrologyReport } = require("../controllers/astrology.controller");

router.post("/generate", generateAstrologyReport);

module.exports = router;
