const mongoose = require("mongoose");

const AstrologySchema = new mongoose.Schema({
  name: String,
  birthDate: String,
  birthTime: String,
  birthPlace: String,
  suggestion: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Astrology", AstrologySchema);
