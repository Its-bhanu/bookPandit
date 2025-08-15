const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   room: { type: String, required: true }, // `${userId}_${panditId}`
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.export = mongoose.model("Message", messageSchema);
