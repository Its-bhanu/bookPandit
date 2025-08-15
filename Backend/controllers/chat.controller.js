const Message = require('../models/Message.model');

 const getMessages = async (req, res) => {
  const { userId, panditId } = req.params;
   const roomA = `${userId}_${panditId}`;
  const roomB = `${panditId}_${userId}`;
 
  const msgs = await Message.find({ room: { $in: [roomA, roomB] } }).sort({ createdAt: 1 });
  res.json(msgs);
};
module.exports = {getMessages};
