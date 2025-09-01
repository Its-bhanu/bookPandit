const express = require("express");
const router = express.Router();
const { getAstrologyPrediction } = require("../controllers/astrology.controller");

router.post("/prediction", getAstrologyPrediction);

module.exports = router;
