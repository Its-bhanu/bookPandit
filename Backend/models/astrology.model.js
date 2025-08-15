const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  name: String,
  dob: String,
  birthTime: String,
  birthPlace: String,
  question: String,
  prediction: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", predictionSchema);
