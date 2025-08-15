const express = require("express");
const router = express.Router();
const { getAstrologyPrediction } = require("../controllers/predictionController");

router.post("/predict", getAstrologyPrediction);

module.exports = router;
