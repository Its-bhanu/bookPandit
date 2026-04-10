const Message = require('../models/Message.model');
const Booking = require('../models/poojaBooks.model');

const isChatAllowed = async (userId, panditId) => {
  const booking = await Booking.findOne({ userId, panditId }).sort({ createdAt: -1 });
  if (!booking) return false;
  const status = booking.status ? booking.status.toLowerCase() : '';
  return status === 'accepted';
};

const getMessages = async (req, res) => {
  const { userId, panditId } = req.params;

  const role = req.user ? 'user' : 'pandit';
  const requesterId = req.user?._id || req.pandit?._id;
  if (!requesterId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (role === 'user' && String(requesterId) !== String(userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (role === 'pandit' && String(requesterId) !== String(panditId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const allowed = await isChatAllowed(userId, panditId);
  if (!allowed) {
    return res.status(403).json({ message: 'Chat not available yet' });
  }

  const roomA = `${userId}_${panditId}`;
  const roomB = `${panditId}_${userId}`;

  const msgs = await Message.find({ room: { $in: [roomA, roomB] } }).sort({ createdAt: 1 });
  res.json(msgs);
};

module.exports = { getMessages, isChatAllowed };
