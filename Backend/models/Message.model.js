const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
<<<<<<< HEAD
  room: { type: String, required: true },
=======
   room: { type: String, required: true }, // `${userId}_${panditId}`
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

<<<<<<< HEAD
module.exports = mongoose.model("Message", messageSchema);
=======
module.export = mongoose.model("Message", messageSchema);
>>>>>>> c8a339196acd05b09cbbae7dcfb707bfe754784f
